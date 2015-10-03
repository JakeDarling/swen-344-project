require "watir-webdriver"
require "rspec/expectations"

Given(/^I have navigated to the stocks page$/) do
  @b.goto(STOCKS_URL)
end

When(/^I search the symbol "(.*?)"$/) do |arg1|
  pending # express the regexp above with the code you wish you had
end

Then(/^I see the current stock price$/) do
  pending # express the regexp above with the code you wish you had
end

Then(/^I see the highest price of the day$/) do
  pending # express the regexp above with the code you wish you had
end

Then(/^I see the lowest price of the day$/) do
  pending # express the regexp above with the code you wish you had
end

Then(/^I see the highest price of the year$/) do
  pending # express the regexp above with the code you wish you had
end

Then(/^I see the lowest price of the year$/) do
  pending # express the regexp above with the code you wish you had
end

Then(/^I see the interactive chart$/) do
  pending # express the regexp above with the code you wish you had
end