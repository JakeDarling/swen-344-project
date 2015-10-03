require "watir-webdriver"
require "rspec/expectations"
 
 prefs = {
  :download => {
    :prompt_for_download => false,
    :default_directory =>  "/c:/" #/c:/Ruby200-x64/bin/"
  }
}
Given /^I have started the demo rails app$/ do
  @browser ||= Watir::Browser.new :chrome, :prefs => prefs,
    :switches => %w[--ignore-certificate-errors --disable-popup-blocking --disable-translate]
  @browser.goto "http://localhost:3000"
end
 
When /^I open the "([^'']*)" link$/ do |link_text|
    @browser.link(:text, link_text).click
end
 
Then /^I see the Rails Guides page$/ do
  @browser.div(:id => "feature").wait_until_present
  expect(@browser.div(:id => "feature").exists?) 
  @browser.close
end