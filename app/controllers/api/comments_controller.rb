class Api::CommentsController < ApplicationController

	before_action :set_comment, only: [:update]

	def index
	# @tools = Tool.all
		
		@comments = Comment.where(tool_id: params[:id])
		respond_to do |format|			
			format.json {render json: @comments}
		end
	end

	def latest
		@comments = Comment.last(5)
		respond_to do |format|			
			format.json {render json: @comments}
		end
	end

	def update
		respond_to do |format|
			if current_user[:id] == safe_params[:id] or current_user.is_admin?				
				clean_params = {}
				clean_params[:is_pinned] = safe_params[:is_pinned] if safe_params[:is_pinned] != nil
				clean_params[:is_hidden] = safe_params[:is_hidden] if safe_params[:is_hidden] != nil

				if @comment.update(clean_params)							
					format.json { render json: @comment, status: :accepted }
				else 
					format.json { render json: @comment.errors, status: :unprocessable_entity}
				end
			end
		end
	end

	private 
		def set_comment
			@comment = Comment.find(params[:id])
		end

		def safe_params
			params.require(:comment).permit(:id, :is_pinned, :is_hidden)
		end

end
