class InitialMigration < ActiveRecord::Migration
  def change
  	
  	create_table :pages do |t|
      t.string :named_id
  		t.string :name
  		t.text :content
  		t.timestamps
  	end

    add_index :pages, :name, :unique => true
    add_index :pages, :named_id, :unique => true

  	create_table :users do |t|
  		t.string :uid
  		t.string :provider
  		t.string :name
  		t.string :email # user provided
  		t.boolean :is_email_publishable, default: false # user provided
  		t.string :site # user provided
  		t.string :affiliation # user provided
  		t.string :position # user provided
  		t.string :detail # user provided
  		t.string :image_url
  		t.boolean :is_blocked, default: false
      t.boolean :is_admin, default: false
  		# t.integer :role, default: 1
  		t.timestamps
  	end

  	create_table :tools do |t|
  		t.belongs_to :user
  		t.string :name
  		t.text :detail
      t.string :url
  		t.boolean :is_approved, default: false
  		t.string :creators_name
      t.string :creators_email
      t.string :creators_url
      t.string :image_url      
      t.float :star_average, default: 0
      t.boolean :is_hidden, default: false
      t.date :last_updated
      t.string :documentation_url  

      t.text :code
      t.string :repository
      t.integer :language
      t.integer :nature, default: 0
  		
      t.timestamps
  	end

  	add_index :tools, :user_id

  	create_table :tool_ratings do |t|
  		t.belongs_to :user
  		t.belongs_to :tool
      t.boolean :is_hidden, default: false
  		t.integer :stars, default: 0
  		t.timestamps
  	end

  	add_index :tool_ratings, :user_id
		add_index :tool_ratings, :tool_id

  	create_table :comments do |t|
  		t.belongs_to :user
  		t.belongs_to :tool
  		t.text :content
      t.boolean :is_pinned, default: false
      t.boolean :is_hidden, default: false
      t.integer :index
  		t.timestamps
  	end

  	add_index :comments, :user_id
  	add_index :comments, :tool_id
    

    
  	create_table :tool_lists do |t|
      t.belongs_to :user
  		t.string :name
  		t.text :detail
  		t.boolean :is_public, default: true
      t.boolean :is_hidden, default: false
      t.boolean :is_featured, default: false
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
  		t.boolean :is_follower, default: false
      t.boolean :is_editor, default: false
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
  		t.string :text
  		t.timestamps
  	end

  	create_table :tool_tags do |t|
  		t.belongs_to :user
  		t.belongs_to :tool
  		t.belongs_to :tag
      t.boolean :is_hidden, default: false
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
  		t.boolean :is_multiple, default: false
      t.boolean :is_required, default: false
  		t.timestamps
  	end

    create_table :attribute_values do |t|
      t.belongs_to :attribute_type
      t.string :name
      t.integer :index
      t.timestamps
    end

  	create_table :tool_attributes do |t|
  		t.belongs_to :tool
  		t.belongs_to :attribute_type
      t.belongs_to :attribute_value;
      # t.integer :value
  		t.timestamps
  	end

  	add_index :tool_attributes, :tool_id
  	add_index :tool_attributes, :attribute_type_id

    create_table :suggested_tools do |t|
      t.belongs_to :tool
      t.integer :suggested_tool_id
      t.timestamps
    end

  end
end
