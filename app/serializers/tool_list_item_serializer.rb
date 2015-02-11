class ToolListItemSerializer < ActiveModel::Serializer
  attributes :id, :notes, :tool
  

  def tool
  	# puts object.tool
  	# return object.tool
  	result = {
      id: object.tool.id,
  		name: object.tool.name,
  		star_average: object.tool.star_average,
  		thumb_url: object.tool.image_url ? object.tool.image_url.gsub(/\.png/, "-thumb.png") : ""
  		
  	}
  end
end
