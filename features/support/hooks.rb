require 'watir-webdriver'
require 'rspec/expectations'
require 'logger'

# URL configurations, should probably be pulled into a config file
APP_URL = 'https://epicapp-dev.herokuapp.com' #'http://localhost:3000'
STOCKS_URL = APP_URL + '/stocks'
CALENDAR_URL = APP_URL + '/calendar'

log = Logger.new(STDOUT)

# Preferences for using chrome, chromedriver.exe needs to go in default_directory
chrome_prefs = {
  :download => {
    :prompt_for_download => false,
    :default_directory =>  '/c/:' #/c:/Ruby200-x64/bin/'
  }
}

Before do |scenario|
    @b = Watir::Browser.new :firefox
    # Uncomment and download the chromedriver to use chrome 
    #@b = Watir::Browser.new :chrome, :prefs => prefs,
    #    :switches => %w[--ignore-certificate-errors --disable-popup-blocking --disable-translate]
    log.info 'Started browser: ' + @b.to_s 
end

After do
    @b.close
end