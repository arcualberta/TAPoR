class Api::PagesController < ApplicationController

	before_action :set_page, only: [:update, :show, :destroy]

	def index
		@pages = Page.all
		respond_to do |format|			
			format.json {render json: @pages, each_serializer: PagePreviewSerializer, status: :ok}
		end

	end

	# def create
	# 	if current_user and current_user.is_admin?
	# 		respond_to do |format|
	# 			Page.transaction do
	# 				begin
	# 					@page = Page.create({
	# 						name: safe_params[:name],
	# 						content: safe_params[:content]
	# 					})
	# 				rescue
	# 					format.json { render json: @tool.errors, status: :unprocessable_entity }
	# 				end
	# 			end
	# 		end
	# 	end
	# end

	def update
		if current_user and current_user.is_admin?
			respond_to do |format|
				Page.transaction do
					begin
						# @page = Page.update({
						# 	name: safe_params[:name],
						# 	content: safe_params[:content]
						# })

						@page = Page.find_or_create_by( name: safe_params[:name]);
						@page.content = safe_params[:content]
						@page.save();
						format.json { render json: @page, status: :ok }
					rescue
						format.json { render json: @page.errors, status: :unprocessable_entity }
					end
				end
			end
		end
	end

	def show
		respond_to do |format|						
			puts @page
			format.json { render json: @page, include: :content, status: :ok}			
		end
	end

	def destroy

	end

	private 
		def set_page
			puts params[:name]
			@page = Page.where(name: params[:id]).take
		end

		def safe_params
			params.require(:page).permit(:name, :content);
		end

end
