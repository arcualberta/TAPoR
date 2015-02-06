class AttributeTypeSerializer < ActiveModel::Serializer
  attributes :id, :name, :is_multiple, :is_required
  has_many :attribute_values
end