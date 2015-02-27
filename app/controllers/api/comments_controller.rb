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
		@comments = Comment.last(5)
		respond_to do |format|			
			format.json {render json: @comments, status: :ok}
		end
	end

	def create
		puts "CREATING"
		respond_to do |format|
			@comment = Comment.create({
				tool_id: params[:tool_id],
				user_id: current_user[:id],
				content: safe_params[:content],
				# is_pinned: safe_params[:is_pinned],
				# is_hidden: safe_params[:is_hidden]
			});

			if @comment.save()
				format.json { render json: @comment, status: :accepted }
			else
				format.json { render json: @comment.errors, status: :unprocessable_entity}
			end

		end
	end

	def update
		puts "UPDATING		"
		respond_to do |format|
			if current_user[:id] == safe_params[:id] or current_user.is_admin?				
				clean_params = {}
				clean_params[:is_pinned] = safe_params[:is_pinned] if safe_params[:is_pinned] != nil
				clean_params[:is_hidden] = safe_params[:is_hidden] if safe_params[:is_hidden] != nil
				clean_params[:content] = safe_params[:content];

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
			params.require(:comment).permit(:id, :tool_id, :content, :is_pinned, :is_hidden)
		end

end
