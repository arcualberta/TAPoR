class Api::ToolListsController < ApplicationController

	before_action :set_tool_list, only: [:edit, :update, :destroy]

	def index
		puts params[:is_editor].to_boolean
		puts params[:is_follower].to_boolean
		params[:is_editor] = params[:is_editor].to_boolean
		params[:is_follower] = params[:is_follower].to_boolean

		if params[:is_editor] and params[:is_follower]			
			puts "1"
			@tool_lists = ToolList.joins(:tool_list_user_roles).where('tool_lists.user_id = ? AND tool_list_user_roles.is_editor = ? AND tool_list_user_roles.is_follower = ?', current_user[:id], params[:is_editor], params[:is_follower])
		elsif params[:is_editor] or params[:is_follower]		
			puts "2"
			@tool_lists = ToolList.joins(:tool_list_user_roles).where('tool_lists.user_id = ? AND (tool_list_user_roles.is_editor = ? OR tool_list_user_roles.is_follower = ?)', current_user[:id], params[:is_editor], params[:is_follower])
		else
			if current_user.is_admin?
				puts "all"
				@tool_lists = ToolList.all
			else
				puts "punlic"
				@tool_lists = ToolList.where is_public: true
			end
		end			

		respond_to do |format|			
			format.json {render json: @tool_lists}
		end
	end

	def show 
		respond_to do |format|
			@tool_list = ToolList.find(params[:id]);
			# format.json { render json: @tool, include_comments: params[:include_comments] }			
			format.json { render json: @tool_list}			
		end
	end


	def create
		respond_to do |format|
			ToolList.transaction do
				begin
					# create tool list
					@tool_list = ToolList.create({
						user_id: current_user[:id],
						name: safe_params[:name],
						description: safe_params[:description],
						is_public: safe_params[:is_public],
					})	

					# add items to tool list
					if params[:tool_list_items]
						params[:tool_list_items].each_with_index do |item, index|
							@tool_list.tool_list_items.create({							
								tool_id: item[:id],
								index: index.to_i,
								notes: item[:notes]
							});
						end
					end

					# add tool list editor and follower

					@tool_list.tool_list_user_roles.create({
						user_id: current_user[:id],
						is_editor: true,
						is_follower: true
					})


					format.json { render json: @tool_list, status: :created }

				rescue ActiveRecord::RecordInvalid
					format.json { render json: @tool_list.errors, status: :unprocessable_entity }
				end
			end
		end
	end

	def contributing
		# @tool_lists = ToolList.where is_public: true
		# respond_to do |format|			
		# 	format.json {render json: @tool_lists}
		# end
	end


	private 

		def set_tool_list
			@tool_list = ToolList.find(Params[:id])
		end

		def safe_params	
			params.require(:tool_list).permit(:id, :name, :description, :is_public);
		end
end