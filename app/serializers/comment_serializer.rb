class CommentSerializer < ActiveModel::Serializer
  attributes :id, :content, :is_pinned, :is_hidden, :index, :tool
  has_one :user  

  def content
  	ActionController::Base.helpers.sanitize(object[:content])
  end

  def tool
  	result = {
  		id: object.tool[:id],
  		name: object.tool[:name],
  	}
  end
end
