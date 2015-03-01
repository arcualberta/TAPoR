class ToolAttribute < ActiveRecord::Base
	belongs_to :tool, inverse_of: :tool_attributes
	belongs_to :attribute_types, inverse_of: :tool_attributes
	has_one :attribute_value
end
