class Event < ActiveRecord::Base
  belongs_to :user
	validates :title, presence:true
	validates :start, presence:true
	validates :end1, presence:true
end
