class User < ActiveRecord::Base
	validates :fbUserId, presence: true, uniqueness: true
end
