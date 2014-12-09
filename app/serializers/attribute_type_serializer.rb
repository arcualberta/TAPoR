class AttributeTypeSerializer < ActiveModel::Serializer
  # attributes :id, :description, :priority, :due_date, :completed
  attributes :id, :name, :possible_values, :is_multiple
end