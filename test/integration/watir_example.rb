require 'watir-webdriver'

# Preferences for using chrome, chromedriver.exe needs to go in default_directory
chrome_prefs = {
  :download => {
    :prompt_for_download => false,
    :default_directory =>  "/c/:" #/c:/Ruby200-x64/bin/"
  }
}

# Uncomment and download the chromedriver to use chrome 
#b = Watir::Browser.new :chrome, :prefs => prefs,
#    :switches => %w[--ignore-certificate-errors --disable-popup-blocking --disable-translate]

# Use firefox by default
b = Watir::Browser.new :firefox

b.goto("http://localhost:3000")

# Find an element using browser.<elemenetName>(:attribute, "value")
b.link(:text, "Rails Guides").click
