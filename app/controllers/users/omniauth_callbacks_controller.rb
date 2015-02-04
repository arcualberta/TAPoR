require File.dirname(__FILE__) + '/../../models/user.rb'

class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  
  def login_behaviour
	  # You need to implement the method below in your model (e.g. app/models/user.rb)
    @user = User.find_or_initialize_by_uid_provider(request.env["omniauth.auth"], current_user) || User.find_by_login_provider(request.env["omniauth.auth"], current_user)

    if @user and @user.persisted?
      update_user()     
      sign_in_and_redirect @user, :event => :authentication
    else
      puts "NOT persisted"      
      update_user()
      sign_in @user
      redirect_to '/users/profile'
    end
	end

  def google_oauth2
		login_behaviour    
  end

  def twitter
  	login_behaviour
  end

  def yahoo
  	login_behaviour
  end

  private

    def update_user
      @user.update({
        name: request.env["omniauth.auth"][:info][:name],
        image_url: request.env["omniauth.auth"][:info][:image]
      })
    end

end