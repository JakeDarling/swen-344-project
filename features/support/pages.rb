
# Implementation of the page object model for this project
# In a real workplace this would be more organized and use modules
HOME ||= '/'
CALENDAR ||= '/calendar'
STOCKS ||= '/stocks'
MY_STOCKS ||= '/my-stocks'
TRANSACTION_HISTORY ||= '/transactions'

# Navigation bar widget
class Navigation
  def initialize(browser)
    @b = browser
  end
  def home
    @b.link(:href => HOME).click
  end
  def calendar
    @b.link(:href => CALENDAR).click
  end
  def stocks
    @b.link(:href => STOCKS).click
  end
  def my_stocks
    @b.link(:href => MY_STOCKS).click
  end
end

# Epic index page
class Dashboard
  def initialize(browser)
    @b = browser
  end
  def on_page?
    @b.div(:id => 'tickerContainer').exists?
  end

  def login
    @b.link(:class => 'facebook').click
  end
  def set_status(status)
    @b.text_field(:name => 'status').when_present.set status
  end
  def submit_status
    @b.button.click
  end
  # True if there is at least one wall post visible (not just the container)
  def wall_post?
    @b.h4(:css => 'div#wall h4').exists?
  end
  # Returns the status text of the nth wall post
  def get_wall_post(index)
    p = @b.p(:css => 'div#wall p', :index => index)
    p.when_present
    p.text
  end
end

# facebook.com website
class Facebook
  def initialize(browser)
    @b = browser
  end

  def login(email, password)
    @b.windows.last.use do
      @b.text_field(:id => 'email').set email
      @b.text_field(:id => 'pass').set password
      @b.label(:id => 'loginbutton').click
    end

  end
end

# Epic stocks page
class Stocks
  def initialize(browser)
    @b = browser
  end
  def on_page?
    false
  end
  def search_symbol(symbol)
    @b.text_field(:name => 'symbol').set symbol
  end
  def has_current?
    @b.div(:id => 'lastTradePrice').exists?
  end
  def has_day_high?
    @b.div(:id => 'daysHigh').exists?
  end
  def has_day_low?
    @b.div(:id => 'daysLow').exists?
  end
  def has_year_high?
    @b.div(:id => 'yearHigh').exists?
  end
  def has_year_low?
    @b.div(:id => 'yearLow').exists?
  end
  def has_chart?
    @b.div(:id => 'chart').exists?
  end
end

class MyStocks
  def initialize(browser)
    @b = browser
  end
  def transaction_history
    @b.link(:href => TRANSACTION_HISTORY).click
  end
  def buy
    @b.link(:id => 'first-buy').when_present.click
  end
  def set_ticker(symbol)
    @b.text_field(:id => 'buy-ticker').when_present.set symbol
  end
  def set_shares(num_shares)
    @b.text_field(:id => 'buy-shares').when_present.set num_shares
  end
  # Confirm in the modal
  def confirm_purchase
    @b.link(:id => 'buy-submit').when_present.click
  end
end

class Transactions
  def initialize(browser)
    @b = browser
  end
  # Return the ticker symbol of the nth row
  def symbol(index)
    @b.tr(:index => index).td(:index => 1).when_present.text
  end
  # Return number of shares for the nth row
  def num_shares(index)
    @b.tr(:index => index).td(:index => 3).when_present.text
  end
  # Return true if this was a purchase, false if sale
  def bought?(index)
    @b.tr(:index => index).td(:index => 4).text == 'buy'
  end
end

# Epic calendar
class Calendar
  def initialize(browser)
    @b = browser
  end
  def on_page?
    false
  end
  def set_title(title)
    @b.text_field(:id => 'titleField').set title
  end
  # Fullcalendar makes this odd, so this just clicks the first entry
  def add_event
    @b.div(:class => 'fc-widget-content').click
  end
  def set_start_time(time)
    @b.text_field(:id => 'startTimeField').set time
  end
  def set_end_time(time)
    @b.text_field(:id => 'endTimeField').set time
  end
  def set_start_day(day)
    @b.text_field(:id => 'startDateField').set day
  end
  def set_end_day(day)
    @b.text_field(:id => 'endDateField').set day
  end
  def save_event
    @b.link(:class => 'closeModal').click
  end
  # True is at least one event exists
  def has_events?
    @b.div(:class => 'fc-event').exists?
  end
end