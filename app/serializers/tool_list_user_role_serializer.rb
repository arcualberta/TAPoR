class ToolListUserRoleSerializer < ActiveModel::Serializer
  attributes :id, :is_follower, :is_editor, :user

  def user
  	return {
			id: object.user.id,
			name: object.user.name,
			image_url: object.user.image_url,
  	}
  end
end
