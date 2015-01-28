class ToolListUserRoleSerializer < ActiveModel::Serializer
  attributes :id, :is_follower, :is_editor, :user_id
end
