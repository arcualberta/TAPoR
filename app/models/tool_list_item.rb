class ToolListItem < ActiveRecord::Base
	belongs_to :tool_list
	belongs_to :tool
end
