class ToolListItemSerializer < ActiveModel::Serializer
  attributes :id, :notes, :tool
  

  def tool
  	return object.tool
  end
end
