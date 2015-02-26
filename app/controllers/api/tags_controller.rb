class Api::TagsController < ApplicationController

	def search
		prefix = params[:query]
		@tags = Tag.where("value LIKE :prefix", prefix: "#{prefix}%")		
		respond_to do |format|			
			format.json {render json: @tags, status: :ok}
		end
	end

	def index
		respond_to do |format|
			# format.json {render json: Tag.all}
			response = {
				max: 0,
				min: 10000000,
				tags: []
			}

			Tag.all.each do |tag|
				tag_count = tag.tools.count;
				if tag_count > 0
					response[:tags].push({
						text: tag[:value],
						weight: tag_count
					})

					if tag_count > response[:max]
						response[:max] = tag_count;
					end
					if tag_count < response[:min]
						response[:min] = tag_count;
					end
				end
			end

			format.json {render json: response, status: :ok}
		end
	end

end
