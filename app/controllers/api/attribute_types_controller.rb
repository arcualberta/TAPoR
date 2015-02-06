class Api::AttributeTypesController < ApplicationController

	# load_and_authorize_resource
	before_action :set_tool, only: [:edit, :update, :destroy]

	def index
		@attributes = AttributeType.all
		respond_to do |format|			
			format.json {render json: @attributes}
		end
	end
	# XXX NEED TO REWRITE TO TAKE INTO ACCOUT ATTRIBUTE VALUES
	def create
		respond_to do |format|
			AttributeType.transaction do
				begin
					@attribute = AttributeType.create({
						name: safe_params[:name],
						is_multiple: safe_params[:is_multiple],
						is_required: safe_params[:is_required]
					});
					
					params[:possible_values].each do |value|
						puts value;
						@attribute.attribute_values.create({
							name: value
						})
					end


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
			params.require(:attribute_type).permit(:name, :is_multiple, :is_required)
		end
end
