@calendar
Feature: Calendar scenarios

  Background:
    Given I have logged in to Epic
    And I have navigated to the calendar page

  @p1 @done
  Scenario: Add new event
    When I choose to add a new calendar event
    And I set the event title
    And I set the start and end day
    And I set the start and end time
    And I confirm the event
    Then the event is displayed on my calendar

  @p1
   Scenario: Edit event
     Given I have created a calendar event
     When I choose to edit the "1st" calendar event
     And I change the start time
     And I change the end time
     Then the updated event is displayed on my calendar

   @p1
   Scenario: Delete event
     Given I have created a calendar event
     When I delete the "1st" calendar event
     Then my calendar does not display any events
