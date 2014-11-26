class Api::ToolsController < ApplicationController
	# load_and_authorize_resource
	before_action :set_tool, only: [:edit, :update, :destroy]
	
	def index
		@tools = Tool.all
		respond_to do |format|			
			format.json {render json: @tools}
		end
	end

	def show
	end

	def create
		@tool = Tool.new(safe_params)
		respond_to do |format|
			if @tool.save
				format.json { render :show, status: :created, location: @tool }
			else 
				format.json { render json: @tool.errors, status: :unprocessable_entity }
			end
		end
	end

	def edit
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
			params[:tool]
		end
end
