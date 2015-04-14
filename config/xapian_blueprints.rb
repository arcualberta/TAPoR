# Index configuration for XapianDb

XapianDb::DocumentBlueprint.setup(:Tool) do |blueprint|
  blueprint.attribute :name, weight: 10
  blueprint.attribute :detail, weight: 5
  blueprint.attribute :user, prefixed: false
  blueprint.attribute :url, prefixed: false
  blueprint.attribute :creators_name, prefixed: false
  blueprint.attribute :creators_url, prefixed: false
  blueprint.attribute :creators_email, prefixed: false
	blueprint.attribute :image_url, prefixed: false
	blueprint.attribute :star_average, prefixed: false
	blueprint.attribute :last_updated, prefixed: false
	blueprint.attribute :documentation_url, prefixed: false
	blueprint.attribute :code, prefixed: false
	blueprint.attribute :language, prefixed: false
	blueprint.attribute :nature, prefixed: false

  blueprint.ignore_if {is_approved == false}
  blueprint.ignore_if {is_hidden == true}


end

XapianDb::DocumentBlueprint.setup(:ToolList) do |blueprint|
  blueprint.attribute :name, weight: 10
	blueprint.attribute :detail, weight: 5

	blueprint.ignore_if {is_public == false}
	blueprint.ignore_if {is_hidden == true}	
end