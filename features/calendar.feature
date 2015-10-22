@calendar
Feature: Calendar scenarios

  Background:
    Given I have logged in to Epic
    And I have navigated to the calendar page

  @p1
  Scenario: Add new event
    When I choose to add a new calendar event
    And I set the date
    And I set the start and end time
    And I add a description
    And I confirm the event
    Then the event is displayed on my calendar

  @p1
   Scenario: Edit event
     Given I have created a calendar event
     When I choose to edit the "1st" calendar event
     And I change the start time
     And I change the end time
     And I change the description
     Then the updated event is displayed on my calendar

