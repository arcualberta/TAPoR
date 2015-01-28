class ToolAttributeSerializer < ActiveModel::Serializer
	attributes :id, :tool_id, :attribute_type_id, :value
end