class ToolSerializer < ActiveModel::Serializer
	attributes :id, :user_id, :name, :description, :is_approved, :image_url, :creators_name, :creators_email, :creators_url, :star_average, :thumb_url, :tool_attributes, :global_tags, :star_average, :url, :last_updated, :user_comment
  has_many :tool_ratings
 	has_many :tags, through: :tool_tags
 	has_many :comments
  # has_many :suggested_tools
 	# has_many :tool_attributes
 	# has_many :attribute_types, through: :tool_attributes

  def tool_ratings
  	object.tool_ratings.where(user_id: current_user)
  end

  # def suggested_tools
  #   result = []

  #   object.suggested_tools.each do |suggested|
  #     tool = Tool.find(suggested.suggested_tool_id);
  #     result.push(tool)
  #   end

  #   return result;
  # end

 	def tags   
 		# object.tags.joins(:tool_tags).where(tool_tags: {user_id: current_user})		
    result = [];
    @tool_tags = ToolTag.where(tool_id: object[:id], user_id: current_user[:id])

    @tool_tags.each do |tool_tag|
      result.push(Tag.find(tool_tag[:tag_id]))
    end

    return result;
	end

  def global_tags
    result = [];
    
    object.tags.each do |tag|
      unless result.include?(tag.value)
        result.push(tag.value)
      end
    end

    return result
  end

  def user_comment
    object.comments.where(user_id: current_user).take()
  end

	def comments
    object.comments.where(is_hidden: false)
		# if @options[:include_comments]
  #   	object.comments.where(is_hidden: false)
  #   else
  #   	object.comments.where(user_id: current_user)
  #   end
  end

  def thumb_url
    return object.image_url ? object.image_url.gsub(/\.png/, "-thumb.png") : "" ;   
  end

  def tool_attributes
    result = []

    @attribute_types = AttributeType.all

    @attribute_types.each do |type|      
      model = []
      ToolAttribute.where(attribute_type_id: type[:id], tool_id: object.id).each do |val|        
        if (type[:is_multiple])
          model.push(val[:value].to_boolean)
        else
          if val[:value] != nil and val[:value] != 0

            @attribute_value = AttributeValue.find(val[:value]);

            model.push({
              id: @attribute_value[:id],
              name: @attribute_value[:name],
              index: @attribute_value[:index],
            })
          else
            model.push({id: "?", name: ""})
          end
        end
      end



      attribute_values = []
      AttributeValue.where(attribute_type_id: type[:id]).each do |value|
        attribute_values.push({
          id: value[:id],
          attribute_type_id: value[:attribute_type_id],
          name: value[:name],
          index: value[:index],
        })
      end

      current_type = {
        id: type[:id],
        name: type[:name],
        is_multiple: type[:is_multiple],
        is_required: type[:is_required],
        attribute_values: attribute_values,
        model: model
      }
      result.push(current_type)
    end

    return result
  end

end
