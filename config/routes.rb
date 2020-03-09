Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  namespace :api, defaults: {format: :json} do
    resources :users, only: [:create, :index]
    resources :decks, only: [:create, :destroy, :update, :show, :index] do
      resources :cards, only: [:index]
      resources :deck_studies, only: [:index, :show]
    end
    resources :cards, only: [:create, :destroy, :update, :show]
    resources :deck_studies, only: [:create, :update, :destroy]
    resource :session, only: [:create, :destroy]
  end

  root to: 'static_pages#root'
end
