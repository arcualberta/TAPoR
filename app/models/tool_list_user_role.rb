class ToolListUserRole < ActiveRecord::Base
	belongs_to :user
	belongs_to :tool_list
	enum role: [ :owner, :curator, :follower ] unless instance_methods.include? :role
end
