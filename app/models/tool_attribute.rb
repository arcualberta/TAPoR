class ToolAttribute < ActiveRecord::Base
	belongs_to :tool, inverse_of: :tool_attributes
	belongs_to :attribute_type, inverse_of: :tool_attributes
end
