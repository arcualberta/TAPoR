class Api::CommentsController < ApplicationController

	before_action :set_comment, only: [:update]

	def index
	# @tools = Tool.all
		
		@comments = Comment.where(tool_id: params[:id])
		respond_to do |format|			
			format.json {render json: @comments, status: :ok}
		end
	end

	def latest
		@comments = Comment.where(is_hidden: false).last(5)
		respond_to do |format|			
			format.json {render json: @comments, status: :ok}
		end
	end

	def create		
		respond_to do |format|
			comment = Comment.new({
				tool_id: params[:tool_id],
				user_id: current_user[:id],
				content: safe_params[:content],
			});

			if comment.save()
				format.json { render json: comment, status: :accepted }
			else
				format.json { render json: comment.errors, status: :unprocessable_entity}
			end

		end
	end

	def update
		respond_to do |format|
			if current_user.is_admin?				
				if @comment.update(safe_params)							
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
			params.require(:comment).permit(:id, :tool_id, :content, :is_pinned, :is_hidden)
		end

end
