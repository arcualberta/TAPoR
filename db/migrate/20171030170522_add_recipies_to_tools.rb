class AddRecipiesToTools < ActiveRecord::Migration
  def change
    add_column :tools, :recipes, :text, null: false
  end
end
