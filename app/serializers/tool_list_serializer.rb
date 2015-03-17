class ToolListSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :is_public, :user, :named_id
  has_many :tool_list_items
  has_many :tool_list_user_roles

  def tool_list_items
  	result = []
  	# missing_content = {
  	# 	id: 0,
  	# 	tool: {
  	# 		id: 0,
	  # 		user_id:0,
	  # 		name:"Mising content",
	  # 		description:"",
	  # 		is_approved:true,
	  # 		image_url:"images/tools/missing.png",  		
	  # 		star_average:0.0,
	  # 		thumb_url:"images/tools/missing-thumb.png"
  	# 	}
  	# };

  	missing_content = ToolListItem.new({
  	})

  	missing_content.tool = Tool.new({  		
  		name: "Content missing",
  		image_url: "images/tools/missing.png",  		
      star_average: 0
  	})

  	object.tool_list_items.each do |item|
  		if ! item.tool.is_hidden?
  			result.push(item)
  		else   		
  			missing_content[:notes] = item.notes;
  			result.push(missing_content)
  		end
  	end

  	puts result
  	return result;

  end

end
