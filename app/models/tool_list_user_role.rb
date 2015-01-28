class ToolListUserRole < ActiveRecord::Base
	belongs_to :user
	belongs_to :tool_list
	enum role: [ :editor, :follower ] unless instance_methods.include? :role
end
