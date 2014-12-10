class InitialMigration < ActiveRecord::Migration
  def change
  	
  	create_table :pages do |t|
  		t.string :name
  		t.text :content
  		t.timestamps
  	end

  	create_table :users do |t|
  		t.string :uid
  		t.string :provider
  		t.string :name
  		t.string :email
  		t.boolean :publish_email, default: false
  		t.string :site
  		t.string :affiliation
  		t.string :position
  		t.string :description
  		t.string :image_url
  		t.boolean :is_blocked, default: false
  		t.integer :role, default: 1
  		t.timestamps
  	end

  	create_table :tools do |t|
  		t.belongs_to :user
  		t.string :name
  		t.text :description
  		t.boolean :is_approved, default: false
  		t.string :image_url
      t.string :creators_name
      t.string :creators_email
      t.string :creators_url

  		t.timestamps
  	end

  	add_index :tools, :user_id

    create_table :categories do |t|
      t.string :name
      t.timestamps
    end

    create_table :tool_categories do |t|
      t.belongs_to :tool
      t.belongs_to :category
      t.timestamps
    end

  	create_table :tool_ratings do |t|
  		t.belongs_to :user
  		t.belongs_to :tool
  		t.integer :stars, default: 0
  		t.timestamps
  	end

  	add_index :tool_ratings, :user_id
		add_index :tool_ratings, :tool_id

  	create_table :comments do |t|
  		t.belongs_to :user
  		t.belongs_to :tool
  		t.text :content
  		t.timestamps
  	end

  	add_index :comments, :user_id
  	add_index :comments, :tool_id

  	create_table :tool_lists do |t|
  		t.string :name
  		t.text :description
  		t.boolean :is_public, default: true
  		t.timestamps
  	end

  	create_table :tool_list_items do |t|
  		t.belongs_to :tool_list
  		t.belongs_to :tool
  		t.integer :index
  		t.text :notes
  		t.timestamps
  	end

  	add_index :tool_list_items, :tool_list_id
  	add_index :tool_list_items, :tool_id

  	create_table :tool_list_user_roles do |t|
  		t.belongs_to :user
  		t.belongs_to :tool_list
  		t.integer :role, default: 2
  		t.timestamps
  	end
  	
  	add_index :tool_list_user_roles, :user_id
  	add_index :tool_list_user_roles, :tool_list_id
  	

  	create_table :tool_use_metrics do |t|
  		t.belongs_to :user
  		t.belongs_to :tool
  		t.timestamps
  	end

  	add_index :tool_use_metrics, :user_id
  	add_index :tool_use_metrics, :tool_id


  	create_table :tags do |t|
  		t.string :tag
  		t.timestamps
  	end

  	create_table :tool_tags do |t|
  		t.belongs_to :user
  		t.belongs_to :tool
  		t.belongs_to :tag
  		t.timestamps
  	end

  	add_index :tool_tags, :user_id
  	add_index :tool_tags, :tool_id
  	add_index :tool_tags, :tag_id

  	create_table :featured_tools do |t|
  		t.belongs_to :tool
  		t.integer :index
  		t.timestamps
  	end

  	add_index :featured_tools, :tool_id

  	create_table :attribute_types do |t|
  		t.string :name
  		t.string :possible_values
  		t.boolean :is_multiple, default: false
  		t.timestamps
  	end

  	create_table :tool_attributes do |t|
  		t.belongs_to :tool
  		t.belongs_to :attribute_type
  		t.string :value
  		t.timestamps
  	end

  	add_index :tool_attributes, :tool_id
  	add_index :tool_attributes, :attribute_type_id

  end
end
