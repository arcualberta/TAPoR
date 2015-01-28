class AttributeTypeSerializer < ActiveModel::Serializer
  attributes :id, :name, :possible_values, :is_multiple
end