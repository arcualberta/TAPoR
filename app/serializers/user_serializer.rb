class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :is_email_publishable, :site, :affiliation, :position, :description, :image_url, :is_blocked, :is_admin
end
