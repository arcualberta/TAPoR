class Api::ToolListsController < ApplicationController

	before_action :set_tool_list, only: [:edit, :update, :destroy]

	def index
		
	end

	def create
		respond_to do |format|
			ToolList.transaction do
				begin

					# create tool list
					@tool_list = ToolList.create({
						name: safe_params[:name],
						description: safe_params[:description],
						is_public: safe_params[:is_public],
					})
					@tool_list.save()
				

					# add items to tool list

					params[:current_list].each_with_index do |item, index|
						@tool_list_item = @tool_list.tool_list_items.create({
							tool_id: item[:id],
							index: index.to_i,
							notes: item[:notes]
						});
					end



					format.json { render json: @tool_list, status: :created }

				rescue ActiveRecord::RecordInvalid
					format.json { render json: @tool_list.errors, status: :unprocessable_entity }
				end
			end
			end
	end

	private 

		def set_tool_list
			@tool_list = ToolList.find(Params[:id])
		end

		def safe_params	
			params.require(:tool_list).permit(:id, :name, :description, :is_public);
		end
end