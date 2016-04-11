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

						new_values = params[:attribute_values]
						old_values = AttributeValue.where attribute_type_id: @attribute_type[:id]

						update_attribute_values(old_values, new_values)

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

		def update_attribute_values(old_values, new_values)

			for new_value in new_values
				if not new_value.has_key?(:id)
					# new
					AttributeValue.create({
						name: new_value[:name],
						attribute_type_id: @attribute_type[:id]
					})
				else
					found_match = false
					for old_value in old_values
						if old_value[:id]	== new_value[:id]
							found_match = true
							if old_value[:name] != new_value[:name]
								old_value[:name] = new_value[:name]
								old_value.save
							end
						end
					end
					if not found_match
						# remove
						old_value.delete()
					end
				end
			end

		end

end
