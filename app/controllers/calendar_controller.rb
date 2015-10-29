class CalendarController < ApplicationController
	def index
	end

	def store_event
		title = params[:title]
		start = params[:start]
		end1 = params[:end]

		user = User.find_by(fbUserId:session[:user])

		event = Event.new(title: title, start: start, end1: end1)

		if event.valid?
			event.save()
		else
			# failure
		end

		puts event.inspect

		render:nothing => true
	end

	def get_my_events
		user = User.find_by(fbUserId:session[:user])
		events = Event.where(user_id:user.id)

		render :json => {events:events}
	end
end
