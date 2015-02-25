class PagePreviewSerializer < ActiveModel::Serializer
  attributes :name, :title

  def title
  	return object[:name].gsub(/_/, ' ');
  end

end
