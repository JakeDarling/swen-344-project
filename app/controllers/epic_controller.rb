class EpicController < ApplicationController
    def index
    end

    def get_front_page_events
	    user = User.find_by(fbUserId:session[:user])
	    events = Event.where(user_id:user.id)

	    render :json => {events:events}
	end
end
