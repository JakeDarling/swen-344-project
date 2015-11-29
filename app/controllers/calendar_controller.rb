class CalendarController < ApplicationController
	def index
	end

	def load_events
	    user = User.find_by(fbUserId:session[:user])
	    events = Event.where(user_id:user.id)

	    render :json => {events:events}
	end

	def store_event
		title = params[:title]
		start = params[:start]
		end1 = params[:end1]

		user = User.find_by(fbUserId:session[:user])

		if validate_event_input(title, start, end1)
      event = Event.new(title: title, start: start, end1: end1, user_id: user.id)

      if event.valid?
        event.save()
      else
        puts "================================================"
        puts "Storing Event failed. Event data entry invalid."
        puts "================================================"
      end
      puts event.inspect
	  else
      puts "============================="
      puts "invalid inputs. return false"
      puts "============================="
	  end

		render:nothing => true
	end
	
	def modify_event
		id = params[:id]
	    title = params[:title]
        start = params[:start]
	    end1 = params[:end1]

	    user = User.find_by(fbUserId:session[:user])
		
		event = Event.find(id)
		
		# Validates all inputs first
		if validate_event_input(title, start, end1)
			# checks if user owns this event in his calendar
			if user.id == event.user_id
				event.title = title
				event.start = start
				event.end1 = end1

				event.save
			else
	        	puts "============================="
	        	puts "modifying event failed. entry failed"
	        	puts "============================="
			end
		else
        	puts "============================="
        	puts "invalid inputs. return false"
        	puts "============================="
		end
			

	    puts event.inspect

	    render:nothing => true
    end

	def validate_event_input(title, start, end1)
    # tReg = /^.{0,100}$/
    # sReg = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
    # eReg = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/

    if title == '' or start == '' or end1 == ''
      return false
    else
      return true
    end
  end
end