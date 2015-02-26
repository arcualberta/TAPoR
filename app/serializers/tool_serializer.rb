class ToolSerializer < ActiveModel::Serializer
	attributes :id, :user_id, :name, :description, :is_approved, :image_url, :creators_name, :creators_email, :creators_url, :star_average, :thumb_url, :url, :last_updated #:global_tags,

  def thumb_url
    return object.image_url ? object.image_url.gsub(/\.png/, "-thumb.png") : "" ;   
  end



end
