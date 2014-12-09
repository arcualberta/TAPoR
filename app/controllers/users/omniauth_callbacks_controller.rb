require File.dirname(__FILE__) + '/../../models/user.rb'

class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  
  def login_behaviour
	  # You need to implement the method below in your model (e.g. app/models/user.rb)
    @user = User.find_or_create_by_uid_provider(request.env["omniauth.auth"], current_user)

    if @user and @user.persisted?
      # flash[:notice] = I18n.t "devise.omniauth_callbacks.success", :kind => "Google"
      sign_in_and_redirect @user, :event => :authentication
    else
      # session["devise.google_data"] = request.env["omniauth.auth"]
      # # redirect_to new_user_registration_url
      # flash[:notice] = "User is not registered for this application";
      # redirect_to root_path
      sign_in_and_redirect @user, :event => :authentication
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

end