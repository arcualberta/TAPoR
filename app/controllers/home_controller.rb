class HomeController < ApplicationController
	def index
	end

	def redirect
		redirect_to "/?goto=" + request.path[1..-1] + "&" + request.query_string
	end
end
