require "watir-webdriver"
require "rspec/expectations"

#TODO put into another file? need to learn ruby
class Dashboard
  def initialize(browser)
    @b = browser
  end
  def on_page?
    @b.div(:id => "tickerContainer").exists?
  end

  def login
      @b.iframe.click
  end
end

class Facebook
  def initialize(browser)
    @b = browser
  end
  def on_page?
    true
  end

  def login(email, password)
    @b.input(:id => "email").set email
    @b.input(:id => "pass").set password
  end
end

Given(/^I have a Facebook developer account$/) do
    @user = {email: "jtd7523" , password: "test1234"}
end

When(/^I navigate to Epic$/) do
    @b.goto(APP_URL)
end

When(/^I choose the login option$/) do
    Dashboard.new(@b).login
end

Then(/^I am redirected to Facebook$/) do
  Facebook.on_page?
end

When(/^I submit my username and password to Facebook$/) do
  Facebook.new(@b).login(@user[:email], @user[:password])
end

Then(/^I see the Epic dashboard$/) do
  expect(Dashboard.new(@b).on_page?)
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