class CommentSerializer < ActiveModel::Serializer
  attributes :id, :content, :is_pinned, :is_hidden, :index, :tool
  has_one :user  

  def tool
  	result = {
  		id: object.tool[:id],
  		name: object.tool[:name],
  	}
  end
end
