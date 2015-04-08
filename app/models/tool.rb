require 'active_record'

class Tool < ActiveRecord::Base
	
	belongs_to :user, inverse_of: :tools
	has_many :tool_use_metrics
	# has_many :users, through: :tool_use_metrics
	has_many :comments
	# has_many :users, through: :comments
	has_many :tool_ratings
	# has_many :users, through: :tool_ratings
	has_many :tool_tags
	has_many :tags, through: :tool_tags
	# has_many :users, through: :tool_tags
	has_many :tool_attributes
	# has_many :attribute_types, through: :tool_attributes
	has_many :tool_list_items
	has_many :tool_lists, through: :tool_list_items
	has_one :featured_tool
	has_many :suggested_tools
	
	enum nature: [ :tool, :code ]
	enum language: [ :python, :php, :r, :javascript, :java, :mathematica, :other ]

	accepts_nested_attributes_for :tool_ratings
end
