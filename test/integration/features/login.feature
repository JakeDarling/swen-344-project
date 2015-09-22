Feature: Login

    @p1
    Scenario: Log in using a Facebook account
        Given I have a Facebook developer account
        When I navigate to Epic
        Then I am redirected to Facebook
        When I submit my username and password to Facebook
        Then I see the Epic dashboard

