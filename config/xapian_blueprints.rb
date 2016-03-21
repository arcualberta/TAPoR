# Index configuration for XapianDb

XapianDb::DocumentBlueprint.setup(:ToolAttribute) do |blueprint|
	blueprint.attribute :id, weight: 10, as: :number
end

XapianDb::DocumentBlueprint.setup(:ToolTag) do |blueprint|
	blueprint.attribute :tag_id, weight: 10, as: :number
end

XapianDb::DocumentBlueprint.setup(:Tool) do |blueprint|
  blueprint.attribute :name, weight: 10, as: :string
  blueprint.attribute :detail, weight: 5, as: :string
  blueprint.attribute :is_hidden, weight: 1
  blueprint.attribute :is_approved, weight: 1
  blueprint.attribute :created_at, as: :date
	# blueprint.attribute :tool_attributes, as: :json
	blueprint.attribute :attribute_value_ids do
		result = '-'
		tool_attributes.each do |val|
			result += val.attribute_value_id.to_s + '-'
		end
		result
	end

	blueprint.attribute :star_average, as: :number
	blueprint.attribute :image_url, as: :string
	blueprint.attribute :id, as: :number
	blueprint.attribute :creators_name, prefixed: false
	blueprint.attribute :creators_url, prefixed: false
	# blueprint.attribute :tool_tags, as: :json
	blueprint.attribute :tag_value_ids do
		result = '-'
		tool_tags.each do |val|
			result += val.tag_id.to_s + '-'
		end
		result
	end


	blueprint.natural_sort_order :name
 	blueprint.base_query do
 		Tool.includes(:tool_attributes)
 	end

  blueprint.ignore_if {is_approved == false}
  blueprint.ignore_if {is_hidden == true}
end

XapianDb::DocumentBlueprint.setup(:ToolList) do |blueprint|
  blueprint.attribute :name, weight: 10
	blueprint.attribute :detail, weight: 5

	blueprint.ignore_if {is_public == false}
	blueprint.ignore_if {is_hidden == true}	
end