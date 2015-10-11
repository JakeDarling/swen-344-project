require 'watir-webdriver'
require 'rspec/expectations'
require_relative '../support/pages'

Given(/^I have navigated to the stocks page$/) do
  @b.goto(STOCKS_URL)
end

When(/^I search the symbol "(.*?)"$/) do |arg1|
  Stocks.search_symbol arg1
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