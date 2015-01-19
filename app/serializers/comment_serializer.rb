class CommentSerializer < ActiveModel::Serializer
  attributes :id, :content, :is_pinned, :is_hidden
  has_one :user  
end
