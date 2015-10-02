require "watir-webdriver"
require "rspec/expectations"

# Preferences for using chrome, chromedriver.exe needs to go in default_directory
chrome_prefs = {
  :download => {
    :prompt_for_download => false,
    :default_directory =>  "/c/:" #/c:/Ruby200-x64/bin/"
  }
}

# URL configurations, should probably be pulled into a config file
APP_URL = "http://localhost:3000"


Given(/^I have a Facebook developer account$/) do
    @user = {username: "TODO" , password: "TODO"}
end

Given (/^I have started a browser$/) do
    # Default to firefox
    @b = Watir::Browser.new :firefox
    # Uncomment and download the chromedriver to use chrome 
    #@b = Watir::Browser.new :chrome, :prefs => prefs,
    #    :switches => %w[--ignore-certificate-errors --disable-popup-blocking --disable-translate]
end

When(/^I navigate to Epic$/) do
    @b.goto(APP_URL)
  pending # express the regexp above with the code you wish you had
end

Then(/^I am redirected to Facebook$/) do
  pending # express the regexp above with the code you wish you had
end

When(/^I submit my username and password to Facebook$/) do
  pending # express the regexp above with the code you wish you had
end

Then(/^I see the Epic dashboard$/) do
  pending # express the regexp above with the code you wish you had
end

Given(/^I have navigated to the dashboard$/) do
    step "I navigate to Epic"
    step "I see the Epic dashboard"
end

Given(/^I have logged in to Epic$/) do
  step "I have a Facebook developer account"
  step "I have started a browser"
  step "I navigate to Epic"
  step "I am redirected to Facebook"
  step "I submit my username and password to Facebook"
end

When(/^I select the logout option$/) do
  pending # express the regexp above with the code you wish you had
end

Then(/^I am signed out of Facebook$/) do
  pending # express the regexp above with the code you wish you had
end