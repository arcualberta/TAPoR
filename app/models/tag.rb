class Tag < ActiveRecord::Base
	has_many :tool_tags, inverse_of: :tag
	has_many :users, through: :tool_tags
	has_many :tools, through: :tool_tags
end
