class ToolSerializer < ActiveModel::Serializer
	attributes :id, :user_id, :name, :detail, :is_approved, :image_url, :creators_name, :creators_email, :creators_url, :star_average, :url, :last_updated, :nature, :language, :code, :repository, :thumb_url, :rating_count, :recipes

  def image_url
    return object.image_url ? object.image_url : "images/tools/missing.jpg";
  end

  def thumb_url
    return object.image_url ? object.image_url.gsub(/\.jpg/, "-thumb.jpg") : "images/tools/missing-thumb.jpg";   
  end

  def rating_count
  	return object.tool_ratings.count
  end

  def detail
    ActionController::Base.helpers.sanitize(object[:detail]);
  end


end
