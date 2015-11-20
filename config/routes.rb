Rails.application.routes.draw do

  post '/associate-user' => 'application#associate_user'
  get '/' => 'epic#index'
  get '/stocks' => 'stocks#index'
  get '/calendar' => 'calendar#index'
  get '/transactions' => 'stocks#render_transactions'
  post '/associate-user' => 'application#associate_user'
  post '/store-event' => 'calendar#store_event'

  get '/load-events' => 'calendar#load_events'

  #stocks actions
  post '/buy-stock' => 'stocks#buy_stock'
  post '/sell-stock' => 'stocks#sell_stock'
  get '/my-stocks' => 'stocks#view_my_stocks'
  get '/get-my-stocks' => 'stocks#get_my_stocks'

  #transactions actions
  post 'upload-transactions' => 'stocks#upload_transactions'
  get '/get-my-transactions' => 'stocks#get_my_transactions'

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

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
