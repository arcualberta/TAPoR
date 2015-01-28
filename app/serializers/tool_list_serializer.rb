class ToolListSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :is_public
  has_many :tool_list_items
  has_many :tool_list_user_roles
end
