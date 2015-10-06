require 'watir-webdriver'
require 'rspec/expectations'

#TODO put into another file? need to learn ruby
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
end

class Facebook
  def initialize(browser)
    @b = browser
  end
  def on_page?
    true
  end

  def login(email, password)
    @b.windows.last.use do
      @b.text_field(:id => 'email').set email
      @b.text_field(:id => 'pass').set password
      @b.label(:id => 'loginbutton').click
    end

  end
end

Given(/^I have a Facebook developer account$/) do
    @user = {email: 'jtd7523@rit.edu' , password: 'test1234'}
end

When(/^I navigate to Epic$/) do
    @b.goto(APP_URL)
end

When(/^I choose the login option$/) do
    Dashboard.new(@b).login
end

Then(/^I am redirected to Facebook$/) do
  Facebook.new(@b).on_page?
end

When(/^I submit my username and password to Facebook$/) do
  Facebook.new(@b).login(@user[:email], @user[:password])
end

Then(/^I see the Epic dashboard$/) do
  expect(Dashboard.new(@b).on_page?)
end

Given(/^I have navigated to the dashboard$/) do
    step 'I navigate to Epic'
    step 'I see the Epic dashboard'
end

Given(/^I have logged in to Epic$/) do
  step 'I have a Facebook developer account'
  step 'I navigate to Epic'
  step 'I choose the login option'
  step 'I submit my username and password to Facebook'
end

When(/^I select the logout option$/) do
  return 1
end

Then(/^I am signed out of Facebook$/) do
  pending # express the regexp above with the code you wish you had
end