class ToolSerializer < ActiveModel::Serializer
	attributes :id, :user_id, :name, :description, :is_approved, :image_url, :creators_name, :creators_email, :creators_url
  has_many :tool_ratings
 	has_many :tags, through: :tool_tags
 	has_many :comments
 	has_many :tool_attributes
 	# has_many :attribute_types, through: :tool_attributes

  def tool_ratings
  	object.tool_ratings.where(user_id: current_user)
  end

 	def tags
 		object.tags.joins(:tool_tags).where(tool_tags: {user_id: current_user})		
	end

	def comments
    object.comments.where(user_id: current_user)
  end


end
