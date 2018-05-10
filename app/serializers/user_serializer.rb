class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :is_email_publishable, :site, :affiliation, :position, :detail, :image_url, :is_blocked, :is_admin

  def email
  	if  (current_user && (current_user[:id] == object[:id])) || object[:is_email_publishable]
  		return object[:email]
  	end
  	return "";
  end

  def image_url
    return object.image_url ? object.image_url : "/img/missing-person.png";
  end
end
