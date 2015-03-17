class AttributeTypeSerializer < ActiveModel::Serializer
  attributes :id, :name, :is_multiple, :is_required, :named_id
  has_many :attribute_values
end