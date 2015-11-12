class StocksController < ApplicationController
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def index
  end

=begin
  display all of the stocks held by the current user
=end
  def view_my_stocks
    render :template => "stocks/my-stocks"
  end

  def get_my_stocks
    user = User.find_by(fbUserId:session[:user])
    stocks = Stock.where(user_id:user.id)

    render :json => {stocks:stocks}
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

    #input validation
    if validate_stock_input(shares, ticker, price)

      #record the transaction
      tran = Transaction.new( ticker_symbol:ticker, \
                              user_id:user.id, \
                              timestamp:DateTime.now, \
                              price:price.to_f.round(2), \
                              shares:shares \
                            )
      if tran.valid?
        tran.save()
      else
        #TODO: render failure template but this shouldn't happen since client validates
        puts "=========================================="
        puts "Transaction failed. transaction entry invalid."
        puts "=========================================="
      end
      puts tran.inspect

      #update Stock table
      stock = Stock.find_by(user_id:user.id, ticker_symbol:ticker)
      cost = (shares.to_i * price.to_f).round(2)
      if stock != nil
        stock.shares += shares.to_i
        stock.base_cost += cost
      else
        stock = Stock.new(ticker_symbol:ticker, shares:shares, user_id:user.id, base_cost:cost)
      end
      
      if stock.valid?
        stock.save()

        #log to console
        puts "==================================="
        puts "Transaction Complete"
        puts "user id: #{user.id}"
        puts "user fbUserId: #{user.fbUserId}"
        puts "stock: #{stock.ticker_symbol}"
        puts "shares: #{tran.shares}"
        puts "price: #{tran.price}"

        puts "shares held: #{stock.shares}"
        puts "base cost: #{stock.base_cost}"
        puts "==================================="
      else
        puts "=========================================="
        puts "Transaction failed. stock entry invalid."
        puts "=========================================="
      end
    else
      puts "============================="
      puts "invalid inputs. return false"
      puts "============================="
    end

    render:nothing => true
  end

=begin
  Sell shares of a stock. Update number of shares for the stock in the Stock 
  table. If the number of shares sold is equal to the number of shares held, 
  delete the entry. Also create an entry in the Transaction table for this transaction

  params:
    ticker - the ticker symbol of the stock purchased
    shares - # of shares purchased
    price - the price of the stock at purchase time
=end
  def sell_stock
    ticker = params[:ticker_symbol]
    shares = params[:shares]
    price = params[:price]
    user = User.find_by(fbUserId:session[:user])

    #input validation
    if validate_stock_input(shares, ticker, price)

      shares = shares.to_i * -1
      price = price.to_f.round(2)

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
        #TODO: render failure template but this shouldn't happen since client validates
        puts "=========================================="
        puts "Transaction failed. transaction entry invalid."
        puts "=========================================="
      end
      puts tran.inspect

      #update Stock table
      stock = Stock.find_by(user_id:user.id, ticker_symbol:ticker)
      cost = (shares * price).round(2)
      if stock != nil
        stock.shares += shares
        stock.base_cost += cost
      else
        #user doesn't own this stock
        ##TODO: render failure template but this shouldn't happen since client validates
        puts "=========================================="
        puts "Transaction failed. transaction entry invalid."
        puts "=========================================="
      end
      
      if stock.valid?
        stock.save()
              #log to console
        puts "==================================="
        puts "Transaction Complete"
        puts "user id: #{user.id}"
        puts "user fbUserId: #{user.fbUserId}"
        puts "stock: #{stock.ticker_symbol}"
        puts "shares: #{tran.shares}"
        puts "price: #{tran.price}"

        puts "shares held: #{stock.shares}"
        puts "base cost: #{stock.base_cost}"
        puts "==================================="
      else
        puts "=========================================="
        puts "Transaction failed. stock entry invalid."
        puts "=========================================="
      end

=begin
      if stock.shares <= 0
        stock.destroy()
        puts "==========================================================="
        puts "User no longer owns any shares of this stock. destroying..."
        puts "==========================================================="
      end
=end

    else
      puts "============================="
      puts "invalid inputs. return false"
      puts "============================="
    end
    render:nothing => true
  end

  def validate_stock_input(shares, ticker, price)
    sReg = /^[0-9]*$/
    tReg = /^[a-zA-Z]+$/
    pReg = /^[+-]?[0-9]{1,3}(?:,?[0-9]{3})*\.[0-9]{2}$/

    if ticker == '' or !tReg.match(ticker) or shares == '' or !sReg.match(shares) or pReg == '' or !pReg.match(price)
      return false
    else
      return true
    end
  end

=begin
  render the transactions page
=end
  def render_transactions
    render :template => "stocks/transactions"
  end

=begin
  return all transactions for the associated user
=end
  def get_my_transactions
    user = User.find_by(fbUserId:session[:user])
    ts = Transaction.where(user_id:user.id)
    render :json => {transactions:ts}
  end
end
