require 'watir-webdriver'
require 'rspec/expectations'
require_relative '../support/pages'

Given(/^I have navigated to the stocks page$/) do
  @b.goto(STOCKS_URL)
end

When(/^I search the symbol "(.*?)"$/) do |arg1|
  Stocks.new(@b).search_symbol arg1
end

Then(/^I see the current stock price$/) do
  expect(Stocks.new(@b).has_current?)
end

Then(/^I see the highest price of the day$/) do
  expect(Stocks.new(@b).has_day_high?)
end

Then(/^I see the lowest price of the day$/) do
  expect(Stocks.new(@b).has_day_low?)
end

Then(/^I see the highest price of the year$/) do
  expect(Stocks.new(@b).has_year_high?)
end

Then(/^I see the lowest price of the year$/) do
  expect(Stocks.new(@b).has_year_low?)
end

Then(/^I see the interactive chart$/) do
  expect(Stocks.new(@b).has_chart?)
end

Given(/^I enter the ticker "([^"]*)"$/) do |arg|
  MyStocks.new(@b).set_ticker arg
end

When(/^I choose the buy option$/) do
  MyStocks.new(@b).buy
end

When(/^I choose (\d+) shares$/) do |arg|
  MyStocks.new(@b).set_shares arg
  @num_shares = arg
end

When(/^I confirm the purchase$/) do
  MyStocks.new(@b).confirm_purchase
end

Then(/^my transaction history shows the purchase$/) do
  expect(Transactions.new(@b).num_shares(1) == @num_shares);
end

And(/^I navigate to my transaction history$/) do
  MyStocks.new(@b).transaction_history
end

Given(/^I have navigated to the my stocks page$/) do
  Navigation.new(@b).my_stocks
end

Given(/^I have purchased some stocks$/) do
  step 'I enter the ticker "AAPL"'
  step 'I choose 10 shares'
  step 'I choose the buy option'
  step 'I confirm the purchase'
end

When(/^I delete my transaction history$/) do
  Transactions.new(@b).delete_history
end

Then(/^my transaction history is empty$/) do
  Transactions.new(@b).has_history?
end