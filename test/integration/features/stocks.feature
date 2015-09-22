Feature: Stocks

Background:
    Given I have logged into Epic 

    @p1 
    Scenario:
        Given I have navigated to the stocks page
        When I search the symbol "AAPL"
        Then I see the current stock price
        And I see the highest price
        And I see the lowest price