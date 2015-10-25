
# Implementation of the page object model for this project
# In a real workplace this would be more organized and use modules

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
    pending 'Not sure if this is table cell or what'
  end
  def has_day_high
    pending 'Not sure if this is table cell or what'
  end
  def has_day_low
    pending 'Not sure if this is table cell or what'
  end
  def has_year_high
    pending 'Not sure if this is table cell or what'
  end
  def has_year_low
    pending 'Not sure if this is table cell or what'
  end
  def has_chart?
    pending 'Not sure if this is table cell or what'
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
  # Clicks the nth day div on the calendar
  def select_day(day_index)
    @b.div(:class => 'TODO').click
  end
  def set_start_time(start_time)
    @b.text_field(:id => 'TODO').set start_time
  end
  def set_end_time(end_time)
    @b.text_field(:id => 'TODO').set end_time
  end
  def set_description(desc)
    @b.text_field(:id => 'TODO').set desc
  end
end