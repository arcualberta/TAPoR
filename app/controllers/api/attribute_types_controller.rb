class Api::AttributeTypesController < ApplicationController

	# load_and_authorize_resource
	before_action :set_tool, only: [:edit, :update, :destroy]

	def index
		@attributes = AttributeType.all
		respond_to do |format|			
			format.json {render json: @attributes}
		end
	end

	def create
		respond_to do |format|
			AttributeType.transaction do
				begin
					@attribute = AttributeType.new({
						name: safe_params[:name],
						possible_values: safe_params[:possible_values],
						is_multiple: safe_params[:is_multiple]
					})
					@attribute.save
					format.json { render json: @attribute, status: :created }
				rescue ActiveRecord::RecordInvalid
					format.json { render json: @tool.errors, status: :unprocessable_entity }
					raise ActiveRecord::Rollback
				end			
			end
		end
	end

	def edit
	end

	def update
	end

	def destroy
	end

	private

		def safe_params
			params.require(:attribute_type).permit(:name, :possible_values, :is_multiple)
		end
end
