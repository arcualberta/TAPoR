class Api::TagsController < ApplicationController

	def search
		prefix = params[:query]
		@tags = Tag.where("text RLIKE '^"+prefix+".*'")		
		respond_to do |format|			
			format.json {render json: @tags, status: :ok}
		end
	end

	def index
		respond_to do |format|
			response = Tag.joins(:tool_tags).select("tags.id as id, tags.text, COUNT(*) AS weight").group('tags.id')
			format.json {render json: response, status: :ok}
		end
	end

end
