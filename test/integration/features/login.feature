Feature: Login and logout

    @p1 @uc1
    Scenario: Log in using a Facebook account
        Given I have a Facebook developer account
        When I navigate to Epic
        Then I am redirected to Facebook
        When I submit my username and password to Facebook
        Then I see the Epic dashboard

    @p1 @uc2
    Scenario: Log out of your Facebook account/Epic
        Given I have logged in to Epic
        When I select the logout option
        Then I am signed out of Facebook
        And I am redirected to Facebook
