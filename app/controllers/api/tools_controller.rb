require 'fileutils'
require 'base64'
require 'RMagick'
include Magick

class Api::ToolsController < ApplicationController
	

	# load_and_authorize_resource
	before_action :set_tool, only: [:edit, :update, :destroy, :update_rating, :update_tags, :update_comments, :suggested, :update_suggested]
	
	def index
		# @tools = Tool.all
		@tools = Tool.where(is_hidden: false)
		respond_to do |format|			
			format.json {render json: @tools, status: :ok}
		end
	end

	def show 
		respond_to do |format|
			@tool = Tool.find(params[:id]);
			# format.json { render json: @tool, include_comments: params[:include_comments] }			
			format.json { render json: @tool, status: :ok}			
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


	def simple_tool(tool) 
		this_tool = {
			name: tool.name,
			id: tool.id,
			image_url: tool.image_url,
			star_average: tool.star_average,
			thumb_url: tool.image_url ? tool.image_url.gsub(/\.png/, "-thumb.png") : ""
		}
		return this_tool;
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
				result.push(simple_tool(Tool.find(suggested[:suggested_tool_id])));
				if result.length == 5
					break;
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
					result.push(simple_tool(Tool.find(@nextMetric.tool_id)));
					if result.length == 5
						break;
					end
				end
			end
			format.json { render json: result};
		end
	end


	def featured
		@featured_tools = FeaturedTool.order(index: :asc)

		tools = []
		@featured_tools.each do |featured|
			tools.push(featured.tool)			
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
						name: safe_params[:name], 
						url: safe_params[:url],
						description: safe_params[:description],
						creators_name: safe_params[:creators_name],
						creators_email: safe_params[:creators_email],
						creators_url: safe_params[:creators_url],
						last_updated: Time.now(),
						user_id: current_user[:id]
					})								
					
					if current_user.is_admin?
						@tool.update(is_approved: safe_params[:is_approved]);
					end

					# stars
					# if params[:tool_ratings] and params[:tool_ratings][:stars] and params[:tool_ratings][:stars] != 0
					if params[:tool_ratings] and params[:tool_ratings].length > 0 and params[:tool_ratings][0][:stars] != 0
						

						@tool_ratings = @tool.tool_ratings.create({
							stars: params[:tool_ratings][0][:stars], 
							user_id: current_user[:id]
						});
						
						@tool_ratings.save
						@tool.star_average = @tool_ratings.stars;
						@tool.save()
					end
					
					# tags
					# if params[:tool_tags] and params[:tool_tags][:tags] and params[:tool_tags][:tags] != ""			
					if params[:tags] and params[:tags].length > 0						
						tags = params[:tags];
						new_tag_ids = []

						# check if tags exists otherwise create
						tags.each do |tag|
							if tag != ""
								currentTag = Tag.find_or_create_by value: tag;
								new_tag_ids.push(currentTag.id);
							end
						end

						new_tag_ids.each do |ids|
						
							@tool_tag = @tool.tool_tags.create({
								tag_id: ids,
								user_id: current_user[:id]
							})
							@tool_tag.save

						end



					end


					# comment
					if params[:comments] and params[:comments].length > 0 and params[:comments][0][:content] != ""
						 puts params[:comments][0];
						@comment = @tool.comments.create({
							content: params[:comments][0][:content], 
							user_id: current_user[:id]
						});
						@comment.save
					end

					# attributes
					# save_parameters(@tool, params[:attribute_types]);
					save_parameters()

					# image

					if params[:image_url] and params[:image_url] != "" and params[:image_url].include? "base64"						
						@tool.image_url = save_image(params[:image_url])
						@tool.save
					end

					

					
					format.json { render json: @tool, status: :created }
				rescue ActiveRecord::RecordInvalid
					format.json { render json: @tool.errors, status: :unprocessable_entity }
					raise ActiveRecord::Rollback
				end
			end
		end
	
	end


	def update_rating
		respond_to do |format|
			# @tool_rating = @tool.tool_ratings.find_or_create_by(user_id: current_user[:id]);
			# if params[:stars] == 0
			# 	@tool_rating.destroy
			# 	format.json {render json: {status: "OK"}, status: :ok}
			# else
			# 	@tool_rating.update(stars: params[:stars]);
			# 	format.json { render json: @tool_rating, status: :ok }
			process_update_rating(params[:stars])
			format.json {render json: {status: "OK"}, status: :ok}
		end		
	end

	def update_tags
		respond_to do |format|
			process_update_tags();
			format.json {render json: {status: "OK"}, status: :ok}
		end
	end

	def update_comments
		respond_to do |format|
			process_update_comments()
			format.json {render json: {status: "OK"}, status: :ok}
		end
	end

	def latest
		respond_to do |format|
			response = [];
			@tools = Tool.limit(5).reverse_order
			@tools.each do |tool|
				response.push(simple_tool(tool));
			end
			format.json { render json: response, status: :ok }
		end
	end

	def update
			respond_to do |format|
				Tool.transaction do
					begin

						# main tool content
						@tool.name = safe_params[:name];
						@tool.description = safe_params[:description];
						@tool.url = safe_params[:url]
						@tool.creators_name = safe_params[:creators_name];
						@tool.creators_email = safe_params[:creators_email];
						@tool.creators_url = safe_params[:creators_url];					
						if current_user.is_admin?
							@tool.is_approved = safe_params[:is_approved];
						end
						
						if safe_params.length >0
							@tool.last_updated = Time.now();
						end

						@tool.save()

						# stars
						if params[:tool_ratings] and params[:tool_ratings].length > 0 #and params[:tool_ratings][0][:stars] != 0
							process_update_rating(params[:tool_ratings][0][:stars])
							# if params[:tool_ratings][0][:stars] == 0
							# 	@user_tool_rating = @tool.tool_ratings.find_by user_id: current_user[:id]
							# 	tool_rating_count = @user_tool_rating.length
	 					# 		if @user_tool_rating
	 					# 			@tool.star_average *= tool_rating_count
	 					# 			@tool.star_average -= @user_tool_rating.stars
							# 		@user_tool_rating.destroy()
							# 		if tool_rating_count != 1
							# 			@tool.star_average /= tool_rating_count - 1
							# 		else
							# 			@tool.star_average = 0;
							# 		end
							# 		@tool.save()
							# 	end
							# else 
							# 	tool_rating_count = @tool.tool_ratings.count
							# 	@tool_ratings = @tool.tool_ratings.find_or_create_by user_id: current_user[:id]
							# 	puts params[:tool_ratings][0][:stars]
							# 	@tool_ratings.stars = params[:tool_ratings][0][:stars]
							# 	@tool_ratings.save()
							# 	puts "here"
							# 	puts @tool.star_average
							# 	puts tool_rating_count
							# 	@tool.star_average *= tool_rating_count
							# 	@tool.star_average += @tool_ratings.stars
							# 	@tool.star_average /= tool_rating_count + 1
							# 	@tool.save()
							# end



						end

						# tags
						# if params[:tool_tags] and params[:tool_tags][:tags] and params[:tool_tags][:tags] != ""

						process_update_tags();

						# comment

						process_update_comments

						# attributes
						save_parameters()
						# XXX update tool
						# image

						if params[:image_url] and params[:image_url] != "" and params[:image_url].include? "base64"						
							# remove old image
							if @tool.image_url
								# XXX FIXME
								FileUtils::rm [File.join('public', @tool.image_url)]
							end
							new_url_path = save_image(params[:image_url])
							@tool.image_url = new_url_path
							@tool.last_updated = Time.now()
							@tool.save()

						end

						# managed comments (changing pinned and hidden status)

						if params[:managed_comments] and params[:managed_comments][:pinned]  
							params[:managed_comments][:pinned].each do |this_comment|
								puts this_comment
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
			# params.require(:tool).permit(:name, :description, :tool_ratings => [:id, :stars]);
			 # params.require(:tool).permit(:name, :description, tool_ratings: :stars);
			params.require(:tool).permit(:name, :description, :is_approved, :creators_name, :creators_email, :creators_url, :url, :image_url);
		end

		def save_image(base_image)
			name = @tool.id.to_s + ".png"
			pathDirectory = (@tool.id / 500).to_i;
			directory = "tools/" + pathDirectory + "/";
			FileUtils::mkdir_p File.join("public", "images", directory)
			path = File.join("public", "images", directory, name)
			decoded = Base64.urlsafe_decode64( base_image.split(",")[1] )
			File.open(path, "wb") { |file| file.write( decoded ) }

			image = ImageList.new(path.to_s);
			image.format = "PNG";

			# resize
			finalWidth = 550; # 900;
			finalHeight = 440;
			image.resize_to_fill!(finalWidth);

			# crop
			image = image.extent(finalWidth, finalHeight);						
			image.write(path.to_s);

			# thumb
			ratio = 0.5;
			thumbnail = image.thumbnail(image.columns*ratio, image.rows*ratio);
			thumbnailPath = File.join("public", "images", directory, @tool.id.to_s + "-thumb.png");
			thumbnail.write(thumbnailPath.to_s);
			path = File.join("images", directory, name)

			return path.to_s

		end

		def process_update_rating(stars)
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
					@comment.content = params[:comments][0][:content]
					@comment.save
				end
			end
		end

		def process_update_tags()
			if params[:tags]
				tags = params[:tags];
				tag_ids = []
				tags.each do |tag|
					@currentTag = Tag.find_or_create_by value: tag
					tag_ids.push(@currentTag)
				end	
				
				@tool_tags = @tool.tool_tags.where( user_id: current_user[:id])


				# adding new tags
				tag_ids.each do |tag_id|
					found = false;
					@tool_tags.each do |tool_tag|
						puts tool_tag.tag_id.to_s + " " + tag_id.id.to_s
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

		def save_parameters()
			tool_attributes = params[:tool_attributes]			
			if tool_attributes
				@tool.tool_attributes.destroy_all()
				@tool.update(last_updated: Time.now())				
				tool_attributes.each do |attribute|
					puts ">>>>" + attribute.to_s
					if attribute[:model] != nil
						attribute[:model].each do |value|
							saved_value = attribute[:is_multiple] ? value : value[:id];
							puts "++++ "  + saved_value.to_s			 
							@tool.tool_attributes.create({
								attribute_type_id: attribute[:id],
								value: saved_value
							})							
						end
					else
						@tool.tool_attributes.create({
							attribute_type_id: attribute[:id],
							value: nil
						})							
					end
				end
			end
		end
end
