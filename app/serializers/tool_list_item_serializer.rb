class ToolListItemSerializer < ActiveModel::Serializer
  attributes :id, :notes
  has_one :tool
end
