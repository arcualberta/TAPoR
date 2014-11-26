class ToolSerializer < ActiveModel::Serializer
  # attributes :id, :description, :priority, :due_date, :completed
  attributes :id, :user_id, :name, :description, :is_approved, :image_url
end