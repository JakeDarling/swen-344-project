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
  Calendar.new(@b).set_start_day 'Nov 06, 2017'
  Calendar.new(@b).set_end_day 'Nov 06, 2017'
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
  step 'I choose to add a new calendar event'
  step 'I set the event title'
  step 'I set the start and end day'
  step 'I set the start and end time'
  step 'I confirm the event'
  step 'the event is displayed on my calendar'
end

When(/^I choose to edit the "(.*?)" calendar event$/) do |arg1|
  Calendar.new(@b).edit_event(0)
end

And(/^I change the start time$/) do
  Calendar.new(@b).set_start_time('5:00 PM')
end

And(/^I change the end time$/) do
  Calendar.new(@b).set_end_time('6:00 PM')
end

And(/^I change the title/) do
  Calendar.new(@b).set_title('An edited title')
end

Then(/^the updated event is displayed on my calendar$/) do
  expect(Calendar.new(@b).has_events?)
end

When(/^I delete the event$/) do
  Calendar.new(@b).delete_event
end

Then(/^my calendar does not display any events$/) do
  expect(! Calendar.new(@b).has_events?)
end

And(/^I set the event title$/) do
  Calendar.new(@b).set_title 'Test Event'
end