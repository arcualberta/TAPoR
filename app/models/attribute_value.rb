class AttributeValue < ActiveRecord::Base
	has_one :attribute_type
	has_one :tool_attribute, dependent: :destroy


	after_destroy do
		ToolAttribute.destroy_all(attribute_value_id: self.id)		
	end
end
