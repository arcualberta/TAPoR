class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :is_email_publishable, :site, :affiliation, :position, :description, :image_url, :is_blocked, :is_admin

  def email
  	if  (current_user && (current_user[:id] == object[:id])) || object[:is_email_publishable]
  		return object[:email]
  	end
  	return "";
  end
end
