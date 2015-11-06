class HomeController < ApplicationController
	def index
	end

	def redirect

		path = request.path[1..-1];

		if path != "home"
			redirect_to "/?goto=" + path + "&" + request.query_string
		else
			redirect_to "/"
		end
	end
end
