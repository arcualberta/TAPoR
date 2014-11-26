class AttributeType < ActiveRecord::Base
	has_many :tool_attributes, inverse_of: :attribute_type
	# has_many :tools, through: :tool_attributes
end
