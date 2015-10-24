class Stock < ActiveRecord::Base
	validates :ticker_symbol, presence:true
	validates :shares, presence:true
	validates :user_id, presence:true
end
