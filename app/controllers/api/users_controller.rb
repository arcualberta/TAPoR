class Api::UsersController < ApplicationController
	# load_and_authorize_resource
	before_action :set_user, only: [:edit, :update, :destroy, :update_is_admin, :update_is_blocked]

	def index
		# @users = User.all
		@users = User.paginate(page: params[:page])
		respond_to do |format|			
			format.json {render json: @users}
		end
	end


	def update

		# change so that only admin can change is_banned and is_admin

		respond_to do |format|
			if @user.update(safe_params)							
				format.json { render json: @user, status: :accepted }
			else 
				format.json { render json: @user.errors, status: :unprocessable_entity}
			end
		end
	end

	private 
		def set_user 
			@user = User.find(params[:id])
		end

		def safe_params
			params.require(:user).permit(:name, :email, :publish_email, :site, :affiliation, :position, :description, :image_url, :is_blocked, :is_admin)
		end

end
