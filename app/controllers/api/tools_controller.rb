require 'fileutils'
require 'base64'
require 'RMagick'
include Magick

class Api::ToolsController < ApplicationController
	

	# load_and_authorize_resource
	before_action :set_tool, only: [:edit, :update, :destroy]
	
	def index
		# @tools = Tool.all
		@tools = Tool.where(is_hidden: false)
		respond_to do |format|			
			format.json {render json: @tools}
		end
	end

	def show 
		respond_to do |format|
			@tool = Tool.find(params[:id]);
			# format.json { render json: @tool, include_comments: params[:include_comments] }			
			format.json { render json: @tool}			
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
						description: safe_params[:description],
						creators_name: safe_params[:creators_name],
						creators_email: safe_params[:creators_email],
						creators_url: safe_params[:creators_url],
						# is_approved: safe_params[:is_approved],
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
					if params[:tool_tags] and params[:tool_tags][:tags] and params[:tool_tags][:tags] != ""			
						
						tags = params[:tool_tags][:tags];
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

					if params[:image] and params[:image] != "" and params[:image].include? "base64"						
						@tool.image_url = save_image(params[:image])
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

	def update
			respond_to do |format|
				Tool.transaction do
					begin

						# main tool content
						@tool.name = safe_params[:name];
						@tool.description = safe_params[:description];
						@tool.creators_name = safe_params[:creators_name];
						@tool.creators_email = safe_params[:creators_email];
						@tool.creators_url = safe_params[:creators_url];					
						if current_user.is_admin?
							@tool.is_approved = safe_params[:is_approved];
						end
						@tool.save()

						# stars
						if params[:tool_ratings] and params[:tool_ratings].length > 0 and params[:tool_ratings][0][:stars] != 0

							if params[:tool_ratings][0][:stars] == 0
								@user_tool_rating = @tool.tool_ratings.find_by user_id: current_user[:id]
								tool_rating_count = @user_tool_rating.length
	 							if @user_tool_rating
	 								@tool.star_average *= tool_rating_count
	 								@tool.star_average -= @user_tool_rating.stars
									@user_tool_rating.destroy()
									if tool_rating_count != 1
										@tool.star_average /= tool_rating_count - 1
									else
										@tool.star_average = 0;
									end
									@tool.save()
								end
							else 
								tool_rating_count = @tool.tool_ratings.count
								@tool_ratings = @tool.tool_ratings.find_or_create_by user_id: current_user[:id]
								puts params[:tool_ratings][0][:stars]
								@tool_ratings.stars = params[:tool_ratings][0][:stars]
								@tool_ratings.save()
								puts "here"
								puts @tool.star_average
								puts tool_rating_count
								@tool.star_average *= tool_rating_count
								@tool.star_average += @tool_ratings.stars
								@tool.star_average /= tool_rating_count + 1
								@tool.save()
							end



						end

						# tags
						if params[:tool_tags] and params[:tool_tags][:tags] and params[:tool_tags][:tags] != ""
							tags = params[:tool_tags][:tags];
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
						end

						# comment

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

						# attributes
						# save_parameters(@tool, params[:attribute_types]);
						save_parameters()
						
						# image

						if params[:image] and params[:image] != "" and params[:image].include? "base64"						
							# remove old image
							if @tool.image_url
								FileUtils::rm [@tool.image_url]
							end
							new_url_path = save_image(params[:image])
							@tool.update(image_url: new_url_path)
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

	# def destroy
	# 	@tool.destroy
	# 	respond_to do |format|
	# 		format.json {head :no_content}
	# 	end
	# end

	private 

		def set_tool
			@tool = Tool.find(params[:id])
		end

		def safe_params
			# params.require(:tool).permit(:name, :description, :tool_ratings => [:id, :stars]);
			 # params.require(:tool).permit(:name, :description, tool_ratings: :stars);
			params.require(:tool).permit(:name, :description, :is_approved, :creators_name, :creators_email, :creators_url);
		end

		def save_image(base_image)
			time = Time.new
			name = @tool.id.to_s + ".png"
			directory = "tools/" + time.year.to_s + "/" + time.month.to_s + "/" + time.day.to_s + "/";
			FileUtils::mkdir_p File.join("public", "images", directory)
			path = File.join("public", "images", directory, name)
			decoded = Base64.urlsafe_decode64( base_image.split(",")[1] )
			File.open(path, "wb") { |file| file.write( decoded ) }

			image = ImageList.new(path.to_s);
			image.format = "PNG";

			# resize
			finalWidth = 1170; # 900;
			finalHeight = 500;
			image.resize_to_fill!(finalWidth);

			# crop
			image = image.extent(finalWidth, finalHeight);						
			image.write(path.to_s);

			# thumb
			thumbnail = image.thumbnail(image.columns*0.2, image.rows*0.2);
			thumbnailPath = File.join("public", "images", directory, @tool.id.to_s + "-thumb.png");
			thumbnail.write(thumbnailPath.to_s);
			path = File.join("images", directory, name)

			return path.to_s

		end

		def save_parameters()
			tool_attributes = params[:tool_attributes]			
			if tool_attributes
				@tool.tool_attributes.destroy_all()
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

			# if attribute_types
				# attributes = attribute_types
				# attributes.each do |attribute|
				# 	# get attribute from database
				# 	savedType = AttributeType.find(attribute[:id])
				# 	valuesToSave = []
				# 	if savedType
				# 		# if exists check is multiple								
				# 		if savedType.is_multiple?									
				# 			if attribute[:model].length == attribute[:possible_values].length
				# 				attribute[:model].each_index do |i|
				# 					if attribute[:model][i]												
				# 						valuesToSave.push(attribute[:possible_values][i])
				# 					end
				# 				end
				# 			end
				# 		else					
				# 			valuesToSave.push(attribute[:model])
				# 		end
						
				# 		possible = savedType.possible_values.split("|");
				# 		should_save = true								
				# 		valuesToSave.each do |newValue|								
				# 			unless possible.include?(newValue)
				# 				should_save = false										
				# 				break
				# 			end
				# 		end	
						
				# 		if should_save									
				# 			@tool_attribute = tool.tool_attributes.find_or_create_by(
				# 				attribute_type_id: savedType.id,
				# 			);
				# 			@tool_attribute[:value] = valuesToSave.join("|")
				# 			@tool_attribute.save()
				# 		end
				# 	end
				# end 
			# end
		end
end
