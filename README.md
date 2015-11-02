# Epic (for SWEN-344)


# Testing
## Getting your code tested and deployed
PRs should now include accompanying integration tests before merging. *After you open a PR, Jake will begin writing tests and merging to your branch*

After your PR merges into the ```develop``` branch, you may run the promote-stage job
[on jenkins](http://vm344a.se.rit.edu:8080/)
Jenkins will push to our dev heroku app, run the appropriate tests, push to heroku staging, and then merge
develop into master and push the new master. Credentials for Jenkins are in the Google Drive "VM and Jenkins Creds" 


## Running Integration Tests  
```cukes.rb``` is a custom script to aid in running tests. It is located in the project root.

By default, it runs all priority 1 (Use Case) tests. *It currently only runs implemented tests*.  
Implemented scenarios must be tagged with @done or this script will not run them.

It also accepts shorthand commands, for example
```
ruby cukes.rb login
```
Will run only the login tests.  

To run any tag, use the passthrough [--tags option](https://github.com/cucumber/cucumber/wiki/Tags) 

```
ruby cukes.rb --tags @demo
```

**Note for PowerShell users:** 
Powershell treats @ as a variable, so any must be escaped with backticks

## Writing new tests
### Setup and teardown
The browser (the @b variable) is created and closed in [features/support/hooks.rb](https://github.com/JakeDarling/swen-344-project/blob/master/features/support/hooks.rb)  
The Before and After methods are per-scenario, so each test will start fresh  

### Feature files and step definitions
Feature files (essentially test suites) are just categories for Scenarios. Scenarios are equivalent to tests. They are made up of Step Definitions. Step Definitions are english statements that map to executable code using regular expressions.

Look to social.feature and social_steps.rb for a project-specific implementation.  

In practice:
```ruby
require 'watir-webdriver'
require 'rspec/expectations'
require_relative '../support/pages'

Given(/^I have done some setup$/)
  # Set some variable to check later
  @status = arg1
  ExamplePage.new(@b).set_status arg1
end
# How to accept a string argument using regex capture
When(/^I set the thing to "(.*?)"$/) do |arg1|
  ExamplePage.new(@b).set_the_thing(arg1)
end
# Use expect from rspec for assertions
Then(/^some result happens$/) do
  # Check the variable from earlier
  expect(ExamplePage.new(@b).did_the_thing? @status)
end
# Reuse steps
Given(/^The thing has been sets$/) do |arg1|
  step 'I have done some setup'
  step 'I set the thing to "blah"'
  step 'some result happened'
end

```

### The page-object model
The idea is to abstract the webdriver code from the test execution code. This way, scenarios can be written and remain relatively unchanged. Only specifics in page classes (element names, ids) need to be changed when the UI changes.  
This is done by creating Ruby classes for each page, and exposing only interactions with the page, *not* webdriver code.  

Look in pages.rb for example page classes.

In practice:
```ruby
class ExamplePage
  def initialize(browser) # Ruby constructor
    @b = browser
  end
  # Good practice to sanity check this page is open before doing other actions
  def on_page? 
    @b.div(:id => 'somethingOnlyOnThisPage').exists?
  end
  # This demonstrates how to set the value of a text field
  def set_status(status)
    @b.text_field(:name => 'status').set status
  end
  # This clicks the first button on the page
  def submit_status
    @b.button.click
  end
end
```
