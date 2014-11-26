class ToolTag < ActiveRecord::Base
	belongs_to :user
	belongs_to :tool
	belongs_to :tag
	validates :tool_tag, :uniqueness => {:scope => [:user, :tool, :tag]}
end
