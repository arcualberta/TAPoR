class PopulateToolRepository < ActiveRecord::Migration
	def self.up    
		say_with_time "Updating tools..." do
			Tool.where(repository: nil).each do |f|				
				f.update_attribute :repository, ''				
			end
		end
	end
end
