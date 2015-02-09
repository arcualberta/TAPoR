class CommentSerializer < ActiveModel::Serializer
  attributes :id, :content, :is_pinned, :is_hidden, :index
  has_one :user  
end
