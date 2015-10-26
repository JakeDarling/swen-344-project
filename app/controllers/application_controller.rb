class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def index
  end
  
=begin
    If the fbUserId hasnt been associated yet, creates a new user instance

    params:
      idString - the fbUserId from fb login
=end
    def associate_user
    	fbUserIdString = params[:idString]	
    	user = User.new(fbUserId:fbUserIdString)
    	if user.valid?	
			 user = User.create(fbUserId:fbUserIdString)
			 success = true
		  end
		  start_session(fbUserIdString)
    end
    helper_method :associate_user
    
=begin
 	starts a session with the associated user

  params:
      fbUserIdString - the fbUserId from fb login
=end
    def start_session(savedUserId)
    	session[:user] = savedUserId
    	render:nothing => true
    end

end
