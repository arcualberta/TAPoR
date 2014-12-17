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

			clean_params = {}

			# clean_params[:name] = safe_params[:name] if safe_params[:name] != nil
			clean_params[:email] = safe_params[:email] if safe_params[:email] != nil
			clean_params[:is_email_publishable] = safe_params[:is_email_publishable] if safe_params[:is_email_publishable] != nil
			clean_params[:site] = safe_params[:site] if safe_params[:site] != nil
			clean_params[:affiliation] = safe_params[:affiliation] if safe_params[:affiliation] != nil
			clean_params[:position] = safe_params[:position] if safe_params[:position] != nil
			clean_params[:description] = safe_params[:description] if safe_params[:description] != nil
			# clean_params[:image_url] = safe_params[:image_url] if safe_params[:image_url] != nil	
			clean_params[:is_blocked] = safe_params[:is_blocked] if safe_params[:is_blocked] != nil and current_user.is_admin?
			clean_params[:is_admin] = safe_params[:is_admin] if safe_params[:is_admin] != nil and current_user.is_admin?

			if @user.update(clean_params)							
				format.json { render json: @user, status: :accepted }
			else 
				format.json { render json: @user.errors, status: :unprocessable_entity}
			end
		end
	end

	def current
		respond_to do |format|						
			format.json { render json: current_user, status: :ok }
		end
	end


	private 
		def set_user 
			@user = User.find(params[:id])
		end

		def safe_params
			params.require(:user).permit(:name, :email, :is_email_publishable, :site, :affiliation, :position, :description, :image_url, :is_blocked, :is_admin)
		end

end
