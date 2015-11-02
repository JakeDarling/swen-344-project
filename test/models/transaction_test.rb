require 'test_helper'

class TransactionTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
  def setup
  	@valid_trans = Transaction.new(ticker_symbol:"AAPL", user_id:1, timestamp:DateTime.now, price:100.00, shares:1)
  	@missing_symbol = Transaction.new(user_id:1, timestamp:DateTime.now, price:100.00, shares:1)
  	@missing_user = Transaction.new(ticker_symbol:"AAPL", timestamp:DateTime.now, price:100.00, shares:1)
  	@missing_timestamp = Transaction.new(ticker_symbol:"AAPL", user_id:1, price:100.00, shares:1)
  	@missing_price = Transaction.new(ticker_symbol:"AAPL", user_id:1, timestamp:DateTime.now)
  end

  test "should be valid" do
  	assert @valid_trans.valid?
  end

  test "ticker_symbol should be present" do
  	assert_not @missing_symbol.valid?
  end

  test "user_id should be present" do
  	assert_not @missing_user.valid?
  end

  test "timestamp should be present" do
  	assert_not @missing_timestamp.valid?
  end

  test "price should be present" do
  	assert_not @missing_price.valid?
  end
end
