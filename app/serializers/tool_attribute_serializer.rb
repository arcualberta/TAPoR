class ToolAttributeSerializer < ActiveModel::Serializer
	attributes :id, :attribute_type
	# has_many :attribute_values

	def attribute_type
		@attribute_type = AttributeType.find(object[:attribute_type_id])
		result = {
			id: @attribute_type.id,
			name: @attribute_type.name,
			is_multiple: @attribute_type.is_multiple,
			is_required: @attribute_type.is_required
		}

		return result
	end
end