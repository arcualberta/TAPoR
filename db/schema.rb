# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20141125172213) do

  create_table "attribute_types", force: true do |t|
    t.string   "name"
    t.string   "possible_values"
    t.boolean  "is_multiple",     default: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "categories", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "comments", force: true do |t|
    t.integer  "user_id"
    t.integer  "tool_id"
    t.text     "content"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "comments", ["tool_id"], name: "index_comments_on_tool_id", using: :btree
  add_index "comments", ["user_id"], name: "index_comments_on_user_id", using: :btree

  create_table "featured_tools", force: true do |t|
    t.integer  "tool_id"
    t.integer  "index"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "featured_tools", ["tool_id"], name: "index_featured_tools_on_tool_id", using: :btree

  create_table "pages", force: true do |t|
    t.string   "name"
    t.text     "content"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "tags", force: true do |t|
    t.string   "tag"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "tool_attributes", force: true do |t|
    t.integer  "tool_id"
    t.integer  "attribute_type_id"
    t.string   "value"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "tool_attributes", ["attribute_type_id"], name: "index_tool_attributes_on_attribute_type_id", using: :btree
  add_index "tool_attributes", ["tool_id"], name: "index_tool_attributes_on_tool_id", using: :btree

  create_table "tool_categories", force: true do |t|
    t.integer  "tool_id"
    t.integer  "category_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "tool_list_items", force: true do |t|
    t.integer  "tool_list_id"
    t.integer  "tool_id"
    t.integer  "index"
    t.text     "notes"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "tool_list_items", ["tool_id"], name: "index_tool_list_items_on_tool_id", using: :btree
  add_index "tool_list_items", ["tool_list_id"], name: "index_tool_list_items_on_tool_list_id", using: :btree

  create_table "tool_list_user_roles", force: true do |t|
    t.integer  "user_id"
    t.integer  "tool_list_id"
    t.integer  "role",         default: 2
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "tool_list_user_roles", ["tool_list_id"], name: "index_tool_list_user_roles_on_tool_list_id", using: :btree
  add_index "tool_list_user_roles", ["user_id"], name: "index_tool_list_user_roles_on_user_id", using: :btree

  create_table "tool_lists", force: true do |t|
    t.string   "name"
    t.text     "description"
    t.boolean  "is_public",   default: true
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "tool_ratings", force: true do |t|
    t.integer  "user_id"
    t.integer  "tool_id"
    t.integer  "stars",      default: 0
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "tool_ratings", ["tool_id"], name: "index_tool_ratings_on_tool_id", using: :btree
  add_index "tool_ratings", ["user_id"], name: "index_tool_ratings_on_user_id", using: :btree

  create_table "tool_tags", force: true do |t|
    t.integer  "user_id"
    t.integer  "tool_id"
    t.integer  "tag_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "tool_tags", ["tag_id"], name: "index_tool_tags_on_tag_id", using: :btree
  add_index "tool_tags", ["tool_id"], name: "index_tool_tags_on_tool_id", using: :btree
  add_index "tool_tags", ["user_id"], name: "index_tool_tags_on_user_id", using: :btree

  create_table "tool_use_metrics", force: true do |t|
    t.integer  "user_id"
    t.integer  "tool_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "tool_use_metrics", ["tool_id"], name: "index_tool_use_metrics_on_tool_id", using: :btree
  add_index "tool_use_metrics", ["user_id"], name: "index_tool_use_metrics_on_user_id", using: :btree

  create_table "tools", force: true do |t|
    t.integer  "user_id"
    t.string   "name"
    t.text     "description"
    t.boolean  "is_approved",    default: false
    t.string   "image_url"
    t.string   "creators_name"
    t.string   "creators_email"
    t.string   "creators_url"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "tools", ["user_id"], name: "index_tools_on_user_id", using: :btree

  create_table "users", force: true do |t|
    t.string   "uid"
    t.string   "provider"
    t.string   "name"
    t.string   "email"
    t.boolean  "is_email_publishable", default: false
    t.string   "site"
    t.string   "affiliation"
    t.string   "position"
    t.string   "description"
    t.string   "image_url"
    t.boolean  "is_blocked",           default: false
    t.boolean  "is_admin",             default: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
