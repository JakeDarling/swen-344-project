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
    ticker = params[:ticker_symbol].upcase
    shares = params[:shares]
    price = params[:price]
    user = User.find_by(fbUserId:session[:user])

    #input validation
    if validate_stock_input(shares, ticker, price, params[:timestamp])
      if params[:timestamp] == nil
        timestamp = DateTime.now
      else
        puts params[:timestamp]
        timestamp = DateTime.strptime(params[:timestamp], '%m/%d/%Y %H:%M:%S %p')
        now = DateTime.now
        timestamp = timestamp.change(:offset => now.zone)
      end

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

      else
        puts "=========================================="
        puts "Transaction failed. stock entry invalid."
        puts "=========================================="
      end

      #record the transaction
      tran = Transaction.new( ticker_symbol:ticker, \
                              user_id:user.id, \
                              timestamp:timestamp, \
                              price:price.to_f.round(2), \
                              shares:shares.to_i \
                            )
      if tran.valid?
        tran.save()
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
        #TODO: render failure template but this shouldn't happen since client validates
        puts "=========================================="
        puts "Transaction failed. transaction entry invalid."
        puts "=========================================="
        return false
      end
      puts tran.inspect

    else
      puts "============================="
      puts "invalid inputs. return false"
      puts "============================="
    end
    if !params[:internal]
      render:nothing => true
    end
    
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
    ticker = params[:ticker_symbol].upcase
    shares = params[:shares]
    price = params[:price]
    user = User.find_by(fbUserId:session[:user])

    #input validation
    if validate_stock_input(shares, ticker, price, params[:timestamp])
      if params[:timestamp] == nil
        timestamp = DateTime.now
      else
        timestamp = DateTime.strptime(params[:timestamp], '%m/%d/%Y %H:%M:%S %p')
        now = DateTime.now
        timestamp = timestamp.change(:offset => now.zone)
      end

      shares = shares.to_i * -1
      price = price.to_f.round(2)

      #update Stock table
      stock = Stock.find_by(user_id:user.id, ticker_symbol:ticker)
      cost = (shares * price).round(2)
      if stock != nil and (shares * -1 <= stock.shares)
        stock.shares += shares
        stock.base_cost += cost
      else
        #user doesn't own this stock
        ##TODO: render failure template but this shouldn't happen since client validates
        puts "=========================================="
        puts "Transaction failed. transaction entry invalid."
        puts "=========================================="
        return false
      end
      
      if stock.valid?
        stock.save()
      else
        puts "=========================================="
        puts "Transaction failed. stock entry invalid."
        puts "=========================================="
      end

      #record the transaction
      tran = Transaction.new( ticker_symbol:ticker, \
                              user_id:user.id, \
                              timestamp:timestamp, \
                              price:price, \
                              shares:shares \
                            )
      if tran.valid?
        tran.save()
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
        #TODO: render failure template but this shouldn't happen since client validates
        puts "=========================================="
        puts "Transaction failed. transaction entry invalid."
        puts "=========================================="
        return false
      end
      puts tran.inspect

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
    if !params[:internal]
      render:nothing => true
    end
  end

  def validate_stock_input(shares, ticker, price, timestamp)
    sReg = /^[0-9]*$/
    tReg = /^[a-zA-Z]+$/
    pReg = /^[+-]?[0-9]{1,3}(?:,?[0-9]{3})*\.[0-9]{2}$/
    tsReg = /^((?:[0]?[1-9]|[1][012])[-:\/.](?:(?:[0-2]?\d{1})|(?:[3][01]{1}))[-:\/.](?:(?:[1]{1}\d{1}\d{1}\d{1})|(?:[2]{1}\d{3})))(?![\d])(\s+)((?:(?:[0-1][0-9])|(?:[2][0-3])|(?:[0-9])):(?:[0-5][0-9])(?::[0-5][0-9])?(?:\s?(?:am|AM|pm|PM))?)$/

    if ticker == '' or !tReg.match(ticker) or shares == '' or !sReg.match(shares) or pReg == '' or !pReg.match(price)
      return false
    else
      if timestamp != nil
        if !tsReg.match(timestamp)
          return false
        end
      end
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

  def upload_transactions
    data = JSON.parse(params[:data]).reverse
    data.each do |row|
      ticker = row[0]
      price = row[1]
      shares = row[2]
      tType = row[3]
      timestamp = row[4]
      index = 0
      successful = 0

      if validate_stock_input(shares, ticker, price, timestamp)
        params[:ticker_symbol] = ticker
        params[:shares] = shares
        params[:price] = price
        params[:timestamp] = timestamp
        params[:internal] = true
        if tType == "buy"
          buy_stock()
        elsif tType == "sell"
          sell_stock()
        else
          puts "========================================"
          puts "invalid transaction type. skipping row"
          puts "========================================" 
        end
      else
        puts "==========================================="
        puts "invalid value(s) in this row. skipping row"
        puts "==========================================="
      end
    end
    puts "========================================"
    puts "Upload complete"
    puts "========================================"
    puts index
    render :json => { :ok => true }, :status => :ok
  end
end
