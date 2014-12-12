class ToolSerializer < ActiveModel::Serializer
	attributes :id, :user_id, :name, :description, :is_approved, :image_url
  has_many :tool_ratings
 	has_many :tags, through: :tool_tags
 	has_many :comments
end
