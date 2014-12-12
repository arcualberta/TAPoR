class ToolSerializer < ActiveModel::Serializer
	attributes :id, :user_id, :name, :description, :is_approved, :image_url
  has_many :tool_ratings
 	has_many :tags, through: :tool_tags
 	has_many :comments

  def tool_ratings
  	object.tool_ratings.where(user_id: current_user)
  end

 	def tags

 		object.tags.joins(:tool_tags).where(tool_tags: {user_id: current_user})
		# object.tool_tags.where(:user_id => current_user)
		# object.tool_tags.joins(:tag).where(:user_id => current_user)
	end

	def comments
    object.comments.where(user_id: current_user)
  end


end
