@stocks
Feature: Stocks

Background:
    Given I have logged in to Epic 

    @p1 @uc5
    Scenario:
        Given I have navigated to the stocks page
        When I search the symbol "AAPL"
        Then I see the current stock price
        And I see the highest price of the day
        And I see the lowest price of the day
        And I see the highest price of the year
        And I see the lowest price of the year
        And I see the interactive chart

    @p1
    Scenario: Buy stocks
        Given I have navigated to the stocks page
        And I have searched "AAPL"
        When I choose the buy option
        And I choose 10 shares
        And I confirm the purchase
        Then my transaction history shows the purchase

