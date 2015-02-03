class ToolListItemSerializer < ActiveModel::Serializer
  attributes :id, :notes, :tool
  

  def tool
  	# puts object.tool
  	# return object.tool
  	result = {
  		name: object.tool.name,
  		thumb_url: object.tool.image_url ? object.tool.image_url.gsub(/\.png/, "-thumb.png") : "" 
  	}
  end
end
