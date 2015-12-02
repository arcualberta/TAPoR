require 'fileutils'
require 'base64'
require 'RMagick'
require 'xapian'

include Magick

class Api::ToolsController < ApplicationController
	

	# load_and_authorize_resource
	before_action :set_tool, only: [:edit, :update, :destroy, :update_rating, :update_tags, :update_comments, :suggested, :update_suggested, :get_tags, :get_ratings, :update_ratings, :get_comments, :get_attributes]

	def index
		params[:page] ||= 1;
		per_page = 10;
		
		if not params[:query] or params[:query] == ""
			query = "*"
		else 
			query = params[:query]
		end

		# XXX Check
		# query += " is_hidden=false ";

		if params[:attribute_values] and params[:attribute_values].length > 0
			params[:attribute_values].split(",").each do |value|				
				query += ' attribute_value_ids:-' + value + '-'
			end
		end

		if params[:tag_values] and params[:tag_values].length > 0
			params[:tag_values].split(",").each do |value|				
				query += ' tag_value_ids:-' + value + '-'
			end
		end

		order = [:name]
		if params[:order]
			if params[:order] == "rating"
				order[0] = :star_average
			elsif params[:order] == "date"
				order[0] = :created_at
			elsif params[:order] == "id"
				order[0] = :id				
			end
		end

		descending  = false		
		if params[:sort] and params[:sort] == "desc"
			descending = true
		end

		docs = Tool.search query, page: params[:page], per_page: per_page, order: order, sort_decending: descending

		tools = []
		docs.each do |doc|
			tools.push (doc.attributes);
		end

		respond_to do |format|
			format.json {render json: tools, root: "tools", meta: {count: docs.hits}, status: :ok}
		end

	end

	def show 
		respond_to do |format|
			@tool = Tool.find_by(id: params[:id]);	
			if not @tool.is_hidden
				format.json { render json: @tool, status: :ok}			
			else 
				format.json {{status: :unauthorized}}			
			end
		end
	end

	def view
		respond_to do |format|
			if current_user 
				@tool_use = ToolUseMetric.create({
					user_id: current_user[:id],
					tool_id: params[:id]
				});	
				format.json { render json: @tool_use, status: :ok}			
			else
				format.json { {status: :unauthorized} }
			end
		end
	end

	
	def update_suggested
		respond_to do |format|
			@tool.suggested_tools.destroy_all
			if params[:suggested]
				params[:suggested].each do |suggested|
					@tool.suggested_tools.create({
						suggested_tool_id: suggested[:id]
					});
				end
			end
			format.json {render json: {status: "OK"}, status: :ok }
		end
	end

	def suggested
		respond_to do |format|
			result = []
			@tool.suggested_tools.each do |suggested|
				tool = Tool.find(suggested[:suggested_tool_id]);
				if not tool.is_hidden
					result.push();
					if result.length == 5
						break;
					end
				end
			end

			format.json { render json: result};

		end
	end

	def also_viewed
		respond_to do |format|
			result = [];
			initialMetrics = ToolUseMetric.where(tool_id: params[:id]);
			initialMetrics.each do |metric|
				@nextMetric = ToolUseMetric.where("user_id = ? AND created_at > ? ", metric[:user_id], metric[:created_at]).take();
				if @nextMetric					
					tool = Tool.find(@nextMetric.tool_id);
					if not tool.is_hidden
						result.push(tool);
						if result.length == 5
							break;
						end
					end
				end
			end
			format.json { render json: result};
		end
	end


	def featured
		featured_tools = FeaturedTool.order(index: :asc)

		tools = []
		featured_tools.each do |featured|
			if not featured.tool.is_hidden
				tools.push(featured.tool)			
			end
		end


		respond_to do |format|
			format.json {render json: tools}
		end
	end

	def featured_edit
		respond_to do |format|
			
			if current_user.is_admin?
				FeaturedTool.destroy_all()
				params[:featured].each_with_index do |tool, index|
					FeaturedTool.create({
						tool_id: tool[:id],
						index: index
					});
				end
			end
			format.json { render json: {status: "OK"}, status: :ok }
			
		end
	end

	def destroy
		respond_to do |format|
			Tool.transaction do
				begin
					if current_user.is_admin? or current_user[:id] == @tool[:user_id]
						@tool.update(is_hidden: true);
						@tool.tool_ratings.update_all(is_hidden: true)			
						@tool.tool_tags.update_all(is_hidden: true)			
						format.json { render json: @tool, status: :ok }
					else
						format.json { render json: @tool, status: :unauthorized }
					end
				rescue ActiveRecord::RecordInvalid
					format.json { render json: @tool.errors, status: :unprocessable_entity }
					raise ActiveRecord::Rollback
				end
			end
		end
	end


	def create		

		respond_to do |format|
			Tool.transaction do
				begin

					@tool = Tool.create({
						name: safe_params[:name].strip, 
						url: safe_params[:url],
						detail: safe_params[:detail].strip,
						creators_name: safe_params[:creators_name].strip,
						creators_email: safe_params[:creators_email].strip,
						creators_url: safe_params[:creators_url].strip,
						last_updated: Time.now(),
						nature: params[:nature][0][:value],
						user_id: current_user[:id]

					});

					if params[:nature][0][:value] == 'code'
						@tool.update(language: params[:language][0][:value])
						@tool.update(code: params[:code])
						@tool.update(repository: params[:repository])
					end
					

					if current_user.is_admin?
						@tool.update(is_approved: safe_params[:is_approved]);
					end

					# attributes

					save_attributes();

					# image

					if params[:image_url] and params[:image_url] != "" and params[:image_url].include? "base64"						
						@tool.image_url = save_image(params[:image_url])
						@tool.save
						XapianDb.reindex @tool
					end

					

					
					format.json { render json: @tool, status: :created }
				rescue ActiveRecord::RecordInvalid
					format.json { render json: @tool.errors, status: :unprocessable_entity }
					raise ActiveRecord::Rollback
				end
			end
		end
	
	end

	def get_attributes
		response = [];

		AttributeType.all.each do |type|
			response_type = {
				id: type.id,
				name: type.name,
				is_multiple: type.is_multiple,
				is_required: type.is_required,
				attribute_values: [],
				selected: []
			}
			
			AttributeValue.where(attribute_type_id: response_type[:id]).each do |value|
				response_value = {
					id: value[:id],
					name: value[:name],
					index: value[:index],
				}

				response_type[:attribute_values].push(response_value);			
				if response_type[:is_multiple]
					this_model = @tool.tool_attributes.find_by(attribute_type_id: response_type[:id], attribute_value_id: response_value[:id])	
					if this_model
						@value = AttributeValue.find(this_model.attribute_value_id);
						response_type[:selected].push({
							id: @value.id,
						});
					end				
				end

			end


			if not response_type[:is_multiple]
				this_model = @tool.tool_attributes.find_by(attribute_type_id: response_type[:id]);
				if this_model and this_model.attribute_value_id
					@value = AttributeValue.find(this_model.attribute_value_id)
					response_type[:selected] = [{
						id: @value.id,						
					}];
				end
			end
			
			response.push(response_type);

		end

		respond_to do |format|
				format.json { render json: response, status: :ok}			
		end		
	end

	def update_tags
		process_update_tags();
		XapianDb.reindex(@tool);
		get_tags();
	end

	def get_tags()
		response = {
			system: [],
			user: [],
		}
		sum_tags = {};
		@tool.tool_tags.each do |tool_tag|								
			if sum_tags.has_key?(tool_tag.tag.text)
				sum_tags[tool_tag.tag.text][:weight] += 1;
			else 
				sum_tags[tool_tag.tag.text] = {
					id: tool_tag.tag.id,
					weight: 1
				};
			end

			if current_user and current_user[:id] == tool_tag.user_id
				response[:user].push(tool_tag.tag.text)
			end

		end

		sum_tags.each do |key, value|
			response[:system].push({
				text: key,
				weight: value[:weight],
				id: value[:id]
			})
		end

		respond_to do |format|
			format.json { render json: response, status: :ok}			
		end
			
	end

	def update_ratings
		process_update_rating();
		get_ratings();
	end

	def get_ratings
		response = {
			system: @tool.star_average,
			rating_count: @tool.tool_ratings.count
		}

		if current_user
			user_rating = @tool.tool_ratings.where(user_id: current_user[:id]).take()

			if (user_rating and user_rating[:stars])
				response[:user] = user_rating[:stars]				
			else				
				response[:user] = 0;
			end
		end
		respond_to do |format|
			format.json {render json: response, status: :ok}
		end
	end

	def get_comments

		response = []

		@tool.comments.each do |comment|
			# comment.content = ActionController::Base.helpers.sanitize(comment.content);
			if (comment.is_hidden and current_user.is_admin?) or not comment.is_hidden?
				response.push(comment)
			end
		end

		respond_to do |format|
			format.json {render json: response, status: :ok}
		end
	end

	def update_comments
		respond_to do |format|
			process_update_comments()
			format.json {render json: {status: "OK"}, status: :ok}
		end
	end

	def by_analysis

		attribute_type = AttributeType.find_by(name: "Type of analysis")
		attribute_values = AttributeValue.select("id, name").where attribute_type_id: attribute_type.id

		tools = Tool
			.select("tool_id, name, tool_attributes.id, GROUP_CONCAT(tool_attributes.attribute_value_id) AS attribute_value_ids")
  		.joins(:tool_attributes)
  		.where("tool_attributes.attribute_type_id = ?", attribute_type.id)
  		.group("tool_id")


		tools.each do |tool|
			if tool.attribute_value_ids
				tool.attribute_value_ids = tool.attribute_value_ids.split(",")
			else
				tool.attribute_value_ids = []
			end
		end

		result = {
			attribute_values: attribute_values,
			tools: tools
		}



		respond_to do |format|
			format.json {render json: result, status: :ok}
		end
	end

	def latest
		respond_to do |format|
			response = [];
			@tools = Tool.where(is_hidden: false).limit(4).reverse_order
			@tools.each do |tool|
				response.push(tool);
			end
			format.json { render json: response, status: :ok }
		end
	end

	def update
			respond_to do |format|
				Tool.transaction do
					begin

						# main tool content
						save_tool = false;
						@tool.name = safe_params[:name].strip;
						@tool.detail = ActionController::Base.helpers.sanitize(safe_params[:detail]).strip;
						@tool.url = safe_params[:url].strip
						@tool.creators_name = safe_params[:creators_name].strip;
						@tool.creators_email = safe_params[:creators_email].strip;
						@tool.creators_url = safe_params[:creators_url].strip;					
						if current_user.is_admin?
							@tool.is_approved = safe_params[:is_approved];
						end
						
						if safe_params.length >0
							@tool.last_updated = Time.now();
						end

						# @tool.save()			
						# XapianDb.reindex @tool
						save_tool = true;
						# tags
						# if params[:tool_tags] and params[:tool_tags][:tags] and params[:tool_tags][:tags] != ""

						process_update_tags();

						# comment

						process_update_comments

						# attributes
						save_attributes();
						# XXX update tool
						# image

						if params[:image_url] and params[:image_url] != "" and params[:image_url].include? "base64"						
							# remove old image
							if @tool.image_url and File.exist?(File.join('public', @tool.image_url))
								# XXX FIXME
								FileUtils::rm [File.join('public', @tool.image_url)]
							end
							new_url_path = save_image(params[:image_url])
							@tool.image_url = new_url_path
							@tool.last_updated = Time.now()
							# @tool.save()
							# XapianDb.reindex @tool
							save_tool = true;

						end

						if save_tool
							@tool.save()							
						end

						# managed comments (changing pinned and hidden status)

						if params[:managed_comments] and params[:managed_comments][:pinned]  
							params[:managed_comments][:pinned].each do |this_comment|
								@comment = Comment.find_by(id: this_comment[:id])
								@comment.index = this_comment[:index];
								@comment.is_pinned = true;
								@comment.is_hidden = this_comment[:is_hidden];
								@comment.save()
							end
						end

						if params[:managed_comments] and params[:managed_comments][:not_pinned]
							params[:managed_comments][:not_pinned].each do |this_comment|
								@comment = Comment.find_by(id: this_comment[:id])
								@comment.index = 0;
								@comment.is_pinned = false;
								@comment.is_hidden = this_comment[:is_hidden];
								@comment.save()
							end

						end

						format.json { render json: @tool, status: :accepted }

					rescue ActiveRecord::RecordInvalid
						format.json { render json: @tool.errors, status: :unprocessable_entity }
						raise ActiveRecord::Rollback
					end
				end
			end
		
	end

	def destroy
		# @tool.destroy
		# use_metrics
		# attributes
		# tags
		# comments
		# ratings
		# tool list item
		
		# set to hidden
		@tool.update({
			is_hidden: true
		});

		respond_to do |format|
			format.json {head :no_content}
		end
	end

	private 

		def set_tool
			@tool = Tool.find(params[:id])
		end

		def safe_params
			# params.require(:tool).permit(:name, :detail, :tool_ratings => [:id, :stars]);
			 # params.require(:tool).permit(:name, :detail, tool_ratings: :stars);
			params.require(:tool).permit(:name, :detail, :is_approved, :creators_name, :creators_email, :creators_url, :url, :image_url, :nature, :language, :code, :repository);
		end

		def save_image(base_image)
			name = @tool.id.to_s + ".png"
			pathDirectory = (@tool.id / 500).to_i;
			directory = "tools/" + pathDirectory.to_s + "/";
			FileUtils::mkdir_p File.join("public", "images", directory)
			path = File.join("public", "images", directory, name)
			decoded = Base64.urlsafe_decode64( base_image.split(",")[1] )
			File.open(path, "wb") { |file| file.write( decoded ) }

			image = ImageList.new(path.to_s);
			image.format = "PNG";

			# resize
			finalWidth = 550; # 900;
			finalHeight = 440;
			# image.resize_to_fill!(finalWidth);
			image.resize_to_fit!(finalWidth, finalHeight);
			img = Image.new(finalWidth, finalHeight) {
				self.background_color = 'white';
 			}
 			img.composite!(image, Magick::CenterGravity, Magick::AtopCompositeOp);
 			image = img;
			image.write(path.to_s);

			# thumb
			ratio = 0.5;
			thumbnail = image.thumbnail(image.columns*ratio, image.rows*ratio);
			thumbnailPath = File.join("public", "images", directory, @tool.id.to_s + "-thumb.png");
			thumbnail.write(thumbnailPath.to_s);
			path = File.join("images", directory, name)

			return path.to_s

		end

		def process_update_rating()
			@tool_rating = @tool.tool_ratings.find_or_create_by(user_id: current_user[:id]);
			if params[:stars] == 0		
				@tool_rating.destroy				
			else
				@tool_rating.update(stars: params[:stars]);				
			end
			@tool.star_average = @tool.tool_ratings.average("stars");
			@tool.save()			
		end


		def process_update_comments()
			if params[:comments] and params[:comments].length > 0 and params[:comments][0][:content] != ""
				if params[:comments][0][:content] == ""
					@user_tool_comment = @tool.comments.find_by user_id: current_user[:id]
					if @user_tool_comment
						@user_tool_comment.destroy()
					end							
				else
					@comment = @tool.comments.find_or_create_by user_id: current_user[:id]
					@comment.content = ActionController::Base.helpers.sanitize(params[:comments][0][:content]);
					@comment.save
				end
			end
		end		

		def process_update_tags()
			if params[:tags]
				tags = params[:tags];
				tag_ids = []
				tags.each do |tag|
					@currentTag = Tag.find_or_create_by text: tag
					tag_ids.push(@currentTag)
				end	
				
				@tool_tags = @tool.tool_tags.where( user_id: current_user[:id])


				# adding new tags
				tag_ids.each do |tag_id|
					found = false;
					@tool_tags.each do |tool_tag|
						if tool_tag.tag_id == tag_id.id
							found = true;
							break;
						end
					end
					if !found
						@test = @tool.tool_tags.create({
							tag_id: tag_id.id,
							user_id: current_user[:id]
						});
						@test.save
					end
				end

				@tool_tags.each do |tool_tag|
					found = false;
					tag_ids.each do |tag_id|
						if tool_tag.tag_id == tag_id.id
							found = true
							break					
						end							
					end
					if !found
						tool_tag.destroy()
					end
				end
			else
				@tool.tool_tags.where( user_id: current_user[:id]).destroy_all();
			end
		end

		def save_attributes()
			tool_attributes = params[:tool_attributes]			
			if tool_attributes
				@tool.tool_attributes.destroy_all()
				@tool.update(last_updated: Time.now())				
				tool_attributes.each do |attribute|
					if attribute[:model] != nil
						attribute[:model].each do |value|
							saved_value = value[:id]
							@tool.tool_attributes.create({
								attribute_type_id: attribute[:id],
								attribute_value_id: saved_value
							})							
						end
					# else
						# @tool.tool_attributes.create({
						# 	attribute_type_id: attribute[:id],
						# 	attribute_value_id: nil
						# })							
					end
				end
			end
		end
end
