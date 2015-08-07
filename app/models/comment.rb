class Comment < ActiveRecord::Base
	belongs_to :user
	belongs_to :tool

	# validates_uniqueness_of :user_id, :scope => [:tool_id]
end
