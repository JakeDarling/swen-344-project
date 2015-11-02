@chat
Feature:
  Background:
    Given I have logged in to Epic

    @p1
    Scenario: Send a chat message
      Given I have opened the chat dialog
      When I type a message into the chat
      And I send the message
      Then I see the message in the global chat