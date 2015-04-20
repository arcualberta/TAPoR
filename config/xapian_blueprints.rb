# Index configuration for XapianDb

XapianDb::DocumentBlueprint.setup(:Tool) do |blueprint|
  blueprint.attribute :name, weight: 10, as: :string
  blueprint.attribute :detail, weight: 5

	blueprint.attribute :tool_attributes, as: :json
 	blueprint.base_query { |p| p.includes(:tool_attributes) }

  blueprint.ignore_if {is_approved == false}
  blueprint.ignore_if {is_hidden == true}


end

XapianDb::DocumentBlueprint.setup(:ToolList) do |blueprint|
  blueprint.attribute :name, weight: 10
	blueprint.attribute :detail, weight: 5

	blueprint.ignore_if {is_public == false}
	blueprint.ignore_if {is_hidden == true}	
end