class Api::AttributeTypesController < ApplicationController

	# load_and_authorize_resource
	before_action :set_attribute_type, only: [:edit, :update, :destroy, :show]

	def index
		@attribute_types = AttributeType.all
		respond_to do |format|			
			format.json {render json: @attribute_types}
		end
	end

	def show
		respond_to do |format|
			format.json { render json: @attribute_type, status: :ok }			
		end
	end

	def create
		if current_user.is_admin?
			respond_to do |format|
				AttributeType.transaction do
					begin
						@attribute_type = AttributeType.create({
							name: safe_params[:name],
							is_multiple: safe_params[:is_multiple],
							is_required: safe_params[:is_required]
						});
						
						index = 0;
						params[:attribute_values].each do |value|						
							@attribute_type.attribute_values.create({
								name: value[:name],
								index: index
							});
							index +=1;
						end


						format.json { render json: @attribute_type, status: :created }
					rescue ActiveRecord::RecordInvalid
						format.json { render json: @attribute_type.errors, status: :unprocessable_entity }
						raise ActiveRecord::Rollback
					end			
				end
			end
		end
	end

	def update
		if current_user.is_admin?
			respond_to do |format|
				AttributeType.transaction do
					begin
						@attribute_type.update({
							name: safe_params[:name],
							is_multiple: safe_params[:is_multiple],
							is_required: safe_params[:is_required]
						});

						# find missing

						# add not in list

						# find if indexes moved

						format.json { render json: @attribute_type, status: :ok }
					rescue ActiveRecord::RecordInvalid
						format.json { render json: @attribute_type.errors, status: :unprocessable_entity }
						raise ActiveRecord::Rollback
					end
				end
			end
		end
	end

	def destroy
	end

	private

		def safe_params
			params.require(:attribute_type).permit(:name, :is_multiple, :is_required)
		end

		def set_attribute_type
			@attribute_type = AttributeType.find(params[:id])
		end
end
