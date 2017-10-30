class ToolSerializer < ActiveModel::Serializer
	attributes :id, :user_id, :name, :detail, :is_approved, :image_url, :creators_name, :creators_email, :creators_url, :star_average, :url, :last_updated, :nature, :language, :code, :repository, :thumb_url, :rating_count, :recipes

  def image_url
    return object.image_url ? object.image_url : "/images/tools/missing.png";
  end

  def thumb_url
    return object.image_url ? object.image_url.gsub(/\.png/, "-thumb.png") : "/images/tools/missing-thumb.png";   
  end

  def rating_count
  	return object.tool_ratings.count
  end

  def detail
    ActionController::Base.helpers.sanitize(object[:detail]);
  end


end
