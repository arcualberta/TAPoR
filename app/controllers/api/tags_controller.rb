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
			# format.json {render json: Tag.all}
			response = [];

			Tag.all.each do |tag|
				weight = tag.tools.count;
				if weight > 0
					response.push({
						text: tag[:text],
						weight: weight,
						id: tag[:id]
					})
				end
			end

			format.json {render json: response, status: :ok}
		end
	end

end
