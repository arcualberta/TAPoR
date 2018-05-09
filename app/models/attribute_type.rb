class AttributeType < ActiveRecord::Base
	has_many :tool_attributes, dependent: :destroy
	has_many :attribute_values, dependent: :destroy
end
