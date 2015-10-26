class Transaction < ActiveRecord::Base
  belongs_to :user
  validates :ticker_symbol, presence:true
  validates :user_id, presence:true
  validates :timestamp, presence:true
  validates :price, presence:true
  validates :shares, presence:true
end
