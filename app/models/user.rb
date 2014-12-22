class User < ActiveRecord::Base
	has_many :tool_list_user_roles
	has_many :tool_lists, through: :tool_list_user_roles
	has_many :tool_ratings
	has_many :tools, through: :tool_ratings
	has_many :comments
	has_many :tools, through: :comments
	has_many :tool_use_metrics
	has_many :tools, through: :tool_use_metrics
	has_many :tools
	
	# enum role: [ :administrator, :user] unless instance_methods.include? :role
	validates_presence_of :uid, :provider
  validates_uniqueness_of :uid, :scope => :provider

	devise :omniauthable, :omniauth_providers => [:google_oauth2, :twitter]
	

	# def self.find_for_google_oauth2(access_token, signed_in_resource=nil)
 #        data = access_token.info
 #        user = User.where(:email => data["email"]).first
 #        # user.name = data[:name]
 #        # user.image = data[:image]
 #        # user.last_log = time = Time.new().to_s
 #        # user.save
 #        return user
	# end

	def self.find_or_initialize_by_uid_provider(access_token, signed_in_resource = nil)
		return User.find_or_initialize_by(uid: access_token.uid, provider: access_token.provider)
	end

end
