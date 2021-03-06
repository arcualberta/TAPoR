Rails.application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  namespace :api, defaults: {format: :json} do
    get 'users/current', to: 'users#current'
    get 'users/:id/tool_lists', to: 'users#get_tool_lists'


    get 'tags/search', to: 'tags#search'
    
    
    get 'tools/latest', to: 'tools#latest'
    get 'tools/by_analysis', to: 'tools#by_analysis'
    get 'tools/featured', to: 'tools#featured'
    get 'tools/:id/tags', to: 'tools#get_tags'    
    get 'tools/:id/ratings', to: 'tools#get_ratings'    
    get 'tools/:id/comments', to: 'tools#get_comments'    
    get 'tools/:id/view', to: 'tools#also_viewed'
    get 'tools/:id/attributes', to: 'tools#get_attributes'
    get 'tools/:id/suggested', to: 'tools#suggested'
    patch 'tools/:id/tags', to: 'tools#update_tags'
    patch 'tools/:id/ratings', to: 'tools#update_ratings'
    patch 'tools/:id/comments', to: 'tools#update_comments'
    post 'tools/:id/suggested', to: 'tools#update_suggested'
    post 'tools/:id/view', to: 'tools#view'
    post 'tools/featured', to: 'tools#featured_edit'
    
    get 'tool_lists/latest', to: 'tool_lists#latest'
    get 'tool_lists/related_by_tool/:id', to: 'tool_lists#related_by_tool'
    get 'tool_lists/related_by_list/:id', to: 'tool_lists#related_by_list'
    get 'tool_lists/by_curator/:id', to: 'tool_lists#by_curator'
    get 'tool_lists/featured', to: 'tool_lists#featured'
    
    get 'tags', to: 'tags#index'
    get 'comments/latest', to: 'comments#latest'
    
    # patch 'users/update_is_admin/:id' => 'users#update_is_admin'
    # patch 'users/update_is_blocked/:id' => 'users#update_is_blocked'

    resources :tools
    resources :users
    resources :attribute_types
    resources :comments
    resources :tool_lists
    resources :pages
  end


  devise_for :users, skip: [:sessions], :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }
  
  devise_scope :user do
    get 'sign_in', :to => 'devise/sessions#new', :as => :new_user_session
    #get 'sign_in', :to => 'devise/sessions#new', :as => :user_session
    get 'sign_out', :to => 'devise/sessions#destroy', :as => :destroy_user_session
  end

  match "api" => proc { [404, {}, ['Invalid API endpoint']] }, via: [:get, :post]
  match "api/*path" => proc { [404, {}, ['Invalid API endpoint']] }, via: [:get, :post]
  # match "/*path" => redirect("/?goto=%{path}"), via: [:get, :post]
  match "/*path", to: 'home#redirect', via: [:get, :post]
  

  # You can have the root of your site routed with "root"
  # root 'welcome#index'
  root 'home#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
  

end
