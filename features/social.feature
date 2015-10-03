Feature: Social integration

Background:
    Given I have logged in to Epic

    @p1 @uc3
    Scenario: Post a Facebook status
        Given I have navigated to the dashboard
        When I enter "Test status" into the Facebook status input
        And I submit my status
        Then my Facebook status is updated

    @p1 @uc4
    Scenario: View my wall
        Given I have navigated to the dashboard
        Then I see posts from my wall

    