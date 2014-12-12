class Api::ToolsController < ApplicationController
	

	# load_and_authorize_resource
	before_action :set_tool, only: [:edit, :update, :destroy]
	
	def index
		# @tools = Tool.all
		@tools = Tool.paginate(:page => params[:page])
		respond_to do |format|			
			format.json {render json: @tools}
		end
	end

	def show 
		respond_to do |format|
			@tool = Tool.find(params[:id]);			
			format.json { render json: @tool }			
		end
	end

	def create		

		respond_to do |format|
			Tool.transaction do
				begin

					@tool = Tool.new({
						name: safe_params[:name], 
						description: safe_params[:description],
						creators_name: safe_params[:creators_name],
						creators_email: safe_params[:creators_email],
						creators_url: safe_params[:creators_url],
						is_approved: safe_params[:is_approved],
						user_id: current_user[:id]
					})								
					@tool.save
					
					# stars
					if params[:tool_ratings] and params[:tool_ratings][:stars] and params[:tool_ratings][:stars] != 0
						
						@tool_ratings = @tool.tool_ratings.create({
							stars: params[:tool_ratings][:stars], 
							user_id: current_user[:id]
						});
						@tool_ratings.save
					end
					
					# tags
					if params[:tool_tags] and params[:tool_tags][:tags] #and params[:tool_ratings][:tags] != 0			
						
						tags = params[:tool_tags][:tags];
						new_tag_ids = []

						# check if tags exists otherwise create
						tags.each do |tag|
							if tag != ""
								currentTag = Tag.find_or_create_by tag: tag;
								new_tag_ids.push(currentTag.id);
								# currentTag = Tag.find_by tag: tag
								# if currentTag
								# 	new_tag_ids.push(currentTag.id)
								# else
								# 	@tag = Tag.new({
								# 		tag: tag
								# 	})
								# 	@tag.save
								# 	new_tag_ids.push(@tag.id)
								# end
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

					if params[:comments] and params[:comments][:content] and params[:comments][:content] != ""
						@comment = @tool.comments.create({
							content: params[:comments][:content], 
							user_id: current_user[:id]
						});
						@comment.save
					end

					# attributes

					if params[:attribute_types]
						attributes = params[:attribute_types]
						attributes.each do |attribute|
							# get attribute from database
							savedType = AttributeType.find(attribute[:id])
							valuesToSave = []
							if savedType
								# if exists check is multiple								
								if savedType.is_multiple?									
									if attribute[:model].length == attribute[:possible_values].length
										attribute[:model].each_index do |i|
											if attribute[:model][i]												
												valuesToSave.push(attribute[:possible_values][i])
											end
										end
									end
								else					
									valuesToSave.push(attribute[:model])
								end
								
								possible = savedType.possible_values.split("|");
								should_save = true								
								valuesToSave.each do |newValue|								
									unless possible.include?(newValue)
										should_save = false										
										break
									end
								end	
								
								if should_save
									
									@tool_attribute = @tool.tool_attributes.create({
										attribute_type_id: savedType.id,
										value: valuesToSave.join("|")
									});
									@tool_attribute.save()
								end

							end
						end 
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
			if @tool.update(safe_params)
				format.json { render :show, status: :ok, location: @tool }
			else 
				format.json { render json: @tool.errors, status: :unprocessable_entity}
			end
		end
	end

	def destroy
		@tool.destroy
		respond_to do |format|
			forman.json {head :no_content}
		end
	end

	private 

		def set_tool
			@tool = Tool.find(params[:id])
		end

		def safe_params
			# params.require(:tool).permit(:name, :description, :tool_ratings => [:id, :stars]);
			 # params.require(:tool).permit(:name, :description, tool_ratings: :stars);
			params.require(:tool).permit(:name, :description, :is_approved, :creators_name, :creators_email, :creators_url);
		end
end
