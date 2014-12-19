class Api::TagsController < ApplicationController

	def search
		prefix = params[:query]
		@tags = Tag.where("tag LIKE :prefix", prefix: "#{prefix}%")		
		respond_to do |format|			
			format.json {render json: @tags}
		end
	end

end
