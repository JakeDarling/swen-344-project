require 'watir-webdriver'
require 'rspec/expectations'
require_relative '../support/pages.rb'

And(/^I have navigated to the calendar page$/) do
  @b.goto CALENDAR_URL
end

When(/^I choose to add a new calendar event$/) do
  Calendar.new(@b).add_event
end

And(/^I set the start and end day$/) do
  Calendar.new(@b).set_start_day 'Nov 06, 2015'
  Calendar.new(@b).set_end_day 'Nov 06, 2015'
end

And(/^I set the start and end time$/) do
  Calendar.new(@b).set_start_time '6:30 AM'
  Calendar.new(@b).set_end_time '7:30 AM'
end

And(/^I confirm the event$/) do
  Calendar.new(@b).save_event
end

Then(/^the event is displayed on my calendar$/) do
  expect(Calendar.new(@b).has_events?)
end

Given(/^I have created a calendar event$/) do
  pending # express the regexp above with the code you wish you had
end

When(/^I choose to edit the "(.*?)" calendar event$/) do |arg1|
  pending # express the regexp above with the code you wish you had
end

And(/^I change the start time$/) do
  pending # express the regexp above with the code you wish you had
end

And(/^I change the end time$/) do
  pending # express the regexp above with the code you wish you had
end

And(/^I change the title/) do
  pending # express the regexp above with the code you wish you had
end

Then(/^the updated event is displayed on my calendar$/) do
  pending # express the regexp above with the code you wish you had
end

When(/^I delete the "([^"]*)" calendar event$/) do |arg|
  pending
end

Then(/^my calendar does not display any events$/) do
  pending
end

And(/^I set the event title$/) do
  Calendar.new(@b).set_title 'Test Event'
end