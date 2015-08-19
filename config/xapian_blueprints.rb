# Index configuration for XapianDb

XapianDb::DocumentBlueprint.setup(:ToolAttribute) do |blueprint|
	blueprint.attribute :id, weight: 10, as: :number
# 	# blueprint.attribute :attribute_value_id, as: :number
# 	# blueprint.attribute :tool, as: :json
# 	# blueprint.attribute :attribute_types, as: :json
# 	# blueprint.attribute :attribute_values, as: :json

end

XapianDb::DocumentBlueprint.setup(:Tool) do |blueprint|
  blueprint.attribute :name, weight: 10, as: :string
  blueprint.attribute :detail, weight: 5, as: :string
  blueprint.attribute :created_at, as: :date
	blueprint.attribute :tool_attributes, as: :json
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
	blueprint.natural_sort_order :name
	
 	blueprint.base_query do
 		Tool.includes(:tool_attributes)
 	end

	blueprint.dependency :ToolAttribute, when_changed: %i(attribute_value) do |att|
		Tool.joins{ tool_attribute }.where{ tool.id == tool_attribute.tool_id }
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