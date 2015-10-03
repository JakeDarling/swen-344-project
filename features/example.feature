Feature: Demo 

  @demo
  Scenario: Follow the "Rails Guides" link in the Rails demo app
    Given I have started the demo rails app
    When I open the "Rails Guides" link
    Then I see the Rails Guides page