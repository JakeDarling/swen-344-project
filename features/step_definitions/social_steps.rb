require 'watir-webdriver'
require 'rspec/expectations'
require_relative '../support/pages'

When(/^I enter "(.*?)" into the Facebook status input$/) do |arg1|
  @status = arg1
  Dashboard.new(@b).set_status arg1
end

When(/^I submit my status$/) do
  Dashboard.new(@b).submit_status
end

Then(/^my Facebook status is updated$/) do
  expect(Dashboard.new(@b).get_wall_post(0) == @status)
end

Then(/^I see posts from my wall$/) do
  expect(Dashboard.new(@b).wall_post?)
end
