require 'test_helper'

class StockTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
  def setup
  	@valid_stock = Stock.new(ticker_symbol:"Test", shares:1)
  	@missing_symbol = Stock.new(shares:1)
  	@missing_shares = Stock.new(ticker_symbol:"Test1")
  end

  test "should be valid" do
	assert @valid_stock.valid?
  end

  test "should be valid with note" do
  	@valid_stock.note = "test note"
  	assert @valid_stock.valid?
  end

  test "ticker_symbol should be present" do
  	assert_not @missing_symbol.valid?
  end

  test "shares should be present" do
  	assert_not @missing_shares.valid?
  end

end
