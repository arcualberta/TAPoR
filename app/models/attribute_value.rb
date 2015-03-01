class AttributeValue < ActiveRecord::Base
	belongs_to :attribute_type
	belongs_to :tool_attribute
end
