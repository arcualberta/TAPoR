class AttributeTypeSerializer < ActiveModel::Serializer
  attributes :id, :name, :is_multiple, :is_required, :attribute_values
  has_many :attribute_values

  def attribute_values
    object.attribute_values.order("name")
	end
end