class ToolList < ActiveRecord::Base
	# belongs_to :tool_list_user_role, inverse_of: :tool_list
	# belongs_to :tool_list_item
	has_many :tool_list_items
	has_many :tool_list_user_roles
end
