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

ActiveRecord::Schema.define(version: 20180426171901) do

  create_table "attribute_types", force: :cascade do |t|
    t.string   "name",        limit: 255
    t.boolean  "is_multiple",             default: false
    t.boolean  "is_required",             default: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "attribute_values", force: :cascade do |t|
    t.integer  "attribute_type_id", limit: 4
    t.string   "name",              limit: 255
    t.integer  "index",             limit: 4
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "comments", force: :cascade do |t|
    t.integer  "user_id",    limit: 4
    t.integer  "tool_id",    limit: 4
    t.text     "content",    limit: 65535
    t.boolean  "is_pinned",                default: false
    t.boolean  "is_hidden",                default: false
    t.integer  "index",      limit: 4
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "comments", ["tool_id"], name: "index_comments_on_tool_id", using: :btree
  add_index "comments", ["user_id"], name: "index_comments_on_user_id", using: :btree

  create_table "featured_tools", force: :cascade do |t|
    t.integer  "tool_id",    limit: 4
    t.integer  "index",      limit: 4
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "featured_tools", ["tool_id"], name: "index_featured_tools_on_tool_id", using: :btree

  create_table "pages", force: :cascade do |t|
    t.string   "named_id",   limit: 255
    t.string   "name",       limit: 255
    t.text     "content",    limit: 65535
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "pages", ["name"], name: "index_pages_on_name", unique: true, using: :btree
  add_index "pages", ["named_id"], name: "index_pages_on_named_id", unique: true, using: :btree

  create_table "suggested_tools", force: :cascade do |t|
    t.integer  "tool_id",           limit: 4
    t.integer  "suggested_tool_id", limit: 4
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "tags", force: :cascade do |t|
    t.string   "text",       limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "tool_attributes", force: :cascade do |t|
    t.integer  "tool_id",            limit: 4
    t.integer  "attribute_type_id",  limit: 4
    t.integer  "attribute_value_id", limit: 4
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "tool_attributes", ["attribute_type_id"], name: "index_tool_attributes_on_attribute_type_id", using: :btree
  add_index "tool_attributes", ["tool_id"], name: "index_tool_attributes_on_tool_id", using: :btree

  create_table "tool_list_items", force: :cascade do |t|
    t.integer  "tool_list_id", limit: 4
    t.integer  "tool_id",      limit: 4
    t.integer  "index",        limit: 4
    t.text     "notes",        limit: 65535
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "tool_list_items", ["tool_id"], name: "index_tool_list_items_on_tool_id", using: :btree
  add_index "tool_list_items", ["tool_list_id"], name: "index_tool_list_items_on_tool_list_id", using: :btree

  create_table "tool_list_user_roles", force: :cascade do |t|
    t.integer  "user_id",      limit: 4
    t.integer  "tool_list_id", limit: 4
    t.boolean  "is_follower",            default: false
    t.boolean  "is_editor",              default: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "tool_list_user_roles", ["tool_list_id"], name: "index_tool_list_user_roles_on_tool_list_id", using: :btree
  add_index "tool_list_user_roles", ["user_id"], name: "index_tool_list_user_roles_on_user_id", using: :btree

  create_table "tool_lists", force: :cascade do |t|
    t.integer  "user_id",     limit: 4
    t.string   "name",        limit: 255
    t.text     "detail",      limit: 65535
    t.boolean  "is_public",                 default: true
    t.boolean  "is_hidden",                 default: false
    t.boolean  "is_featured",               default: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "tool_ratings", force: :cascade do |t|
    t.integer  "user_id",    limit: 4
    t.integer  "tool_id",    limit: 4
    t.boolean  "is_hidden",            default: false
    t.integer  "stars",      limit: 4, default: 0
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "tool_ratings", ["tool_id"], name: "index_tool_ratings_on_tool_id", using: :btree
  add_index "tool_ratings", ["user_id"], name: "index_tool_ratings_on_user_id", using: :btree

  create_table "tool_tags", force: :cascade do |t|
    t.integer  "user_id",    limit: 4
    t.integer  "tool_id",    limit: 4
    t.integer  "tag_id",     limit: 4
    t.boolean  "is_hidden",            default: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "tool_tags", ["tag_id"], name: "index_tool_tags_on_tag_id", using: :btree
  add_index "tool_tags", ["tool_id"], name: "index_tool_tags_on_tool_id", using: :btree
  add_index "tool_tags", ["user_id"], name: "index_tool_tags_on_user_id", using: :btree

  create_table "tool_use_metrics", force: :cascade do |t|
    t.integer  "user_id",    limit: 4
    t.integer  "tool_id",    limit: 4
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "tool_use_metrics", ["tool_id"], name: "index_tool_use_metrics_on_tool_id", using: :btree
  add_index "tool_use_metrics", ["user_id"], name: "index_tool_use_metrics_on_user_id", using: :btree

  create_table "tools", force: :cascade do |t|
    t.integer  "user_id",           limit: 4
    t.string   "name",              limit: 255
    t.text     "detail",            limit: 16777215
    t.string   "url",               limit: 255
    t.boolean  "is_approved",                        default: false
    t.text     "creators_name",     limit: 65535
    t.string   "creators_email",    limit: 255
    t.string   "creators_url",      limit: 255
    t.string   "image_url",         limit: 255
    t.float    "star_average",      limit: 24,       default: 0.0
    t.boolean  "is_hidden",                          default: false
    t.date     "last_updated"
    t.string   "documentation_url", limit: 255
    t.text     "code",              limit: 16777215
    t.string   "repository",        limit: 255
    t.integer  "language",          limit: 4
    t.integer  "nature",            limit: 4,        default: 0
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "recipes",           limit: 16777215,                 null: false
  end

  add_index "tools", ["user_id"], name: "index_tools_on_user_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "uid",                  limit: 255
    t.string   "provider",             limit: 255
    t.string   "name",                 limit: 255
    t.string   "email",                limit: 255
    t.boolean  "is_email_publishable",             default: false
    t.string   "site",                 limit: 255
    t.string   "affiliation",          limit: 255
    t.string   "position",             limit: 255
    t.string   "detail",               limit: 255
    t.string   "image_url",            limit: 255
    t.boolean  "is_blocked",                       default: false
    t.boolean  "is_admin",                         default: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
