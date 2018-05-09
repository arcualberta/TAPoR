class ChangeCreatorsNameToBeTextInTools < ActiveRecord::Migration
  def up
	change_column :tools, :creators_name, :text
  end

  def down
  	change_column :tools, :creators_name, :string
  end
end
