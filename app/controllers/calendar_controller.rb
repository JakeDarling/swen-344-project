class CalendarController < ApplicationController
	def index
	end

	def get_my_events
	    user = User.find_by(fbUserId:session[:user])
	    events = Event.where(user_id:user.id)

	    render :json => {events:events}
	  end

	def store_event
		title = params[:title]
		start = params[:start]
		end1 = params[:end1]

		user = User.find_by(fbUserId:session[:user])

		event = Event.new(title: title, start: start, end1: end1, user_id: user.id)

		if event.valid?
			event.save()
		else
			# failure
		end

		puts event.inspect

		render:nothing => true
	end

    def modify_event
		id = params[:id]
	    title = params[:title]
        start = params[:start]
	    end1 = params[:end1]

	    user = User.find_by(fbUserId:session[:user])
		
		event = Event.find(id)
		
		# checks if user owns this event in his calendar
		if user.id == event.user_id
			event.title = title
			event.start = start
			event.end1 = end1

			event.save
		else
			#failure
		end

	    puts event.inspect

	    render:nothing => true
    end
end
