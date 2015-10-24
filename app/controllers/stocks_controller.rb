class StocksController < ApplicationController
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def index
  end

  def view_my_stocks
    render :template => "stocks/my-stocks" 
  end

=begin
  Buy shares of a stock. If the stock already exists for the user, update shares.
  Otherwise, create a new row in the Stock table. Also create an entry in the
  Transaction table for this transaction

  params:
    ticker - the ticker symbol of the stock purchased
    shares - # of shares purchased
    price - the price of the stock at purchase time
=end  
  def buy_stock
    ticker = params[:ticker_symbol]
    shares = params[:shares]
    price = params[:price]
    user = User.find_by(fbUserId:session[:user])

    #record the transaction
    tran = Transaction.new( ticker_symbol:ticker, \
                            user_id:user.id, \
                            timestamp:DateTime.now, \
                            price:price, \
                            shares:shares \
                          )
    if tran.valid?
      tran.save()
    else
      #render failure template but this shouldn't happen since client validates
    end
    puts tran.inspect

    #update Stock table
    stock = Stock.find_by(user_id:user.id, ticker_symbol:ticker)
    if stock != nil
      stock.shares += shares.to_i
    else
      stock = Stock.new(ticker_symbol:ticker, shares:shares, user_id:user.id)
    end
    
    if stock.valid?
      stock.save()
    else
      #err wat?
    end

    #log to console
    puts "==================================="
    puts "Transaction Complete"
    puts "user id: #{user.id}"
    puts "user fbUserId: #{user.fbUserId}"
    puts "stock: #{stock.ticker_symbol}"
    puts "shares: #{tran.shares}"
    puts "price: #{tran.price}"

    puts "shares held: #{stock.shares}"
    puts "==================================="

    render:nothing => true
  end
end
