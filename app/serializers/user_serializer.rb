class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :publish_email, :site, :affiliation, :position, :description, :image_url, :is_blocked, :is_admin
end
