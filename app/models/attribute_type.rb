class AttributeType < ActiveRecord::Base
	has_many :tool_attributes
	has_many :attribute_values
end
