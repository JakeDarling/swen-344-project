@stocks
Feature: Stocks

Background:
    Given I have logged in to Epic 

    @p1 @uc5 @done
    Scenario:
        Given I have navigated to the stocks page
        When I search the symbol "AAPL"
        Then I see the current stock price
        And I see the highest price of the day
        And I see the lowest price of the day
        And I see the highest price of the year
        And I see the lowest price of the year
        And I see the interactive chart

    @p1 @uc6 @done
    Scenario: Buy stocks
        Given I have navigated to the my stocks page
        When I enter the ticker "AAPL"
        And I choose 10 shares
        And I choose the buy option
        And I confirm the purchase
        And I navigate to my transaction history
        Then my transaction history shows the purchase


    @p1 @uc8 @done
    Scenario: Delete stock history
        Given I have navigated to the my stocks page
        And I have purchased some stocks
        When I navigate to my transaction history
        And I delete my transaction history
        Then my transaction history is empty
