class Stock < ActiveRecord::Base
	validates :ticker_symbol, presence:true
	validates :shares, presence:true
end
