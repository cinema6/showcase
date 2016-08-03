module.exports = {

    'Reelcontent Sign Up Test': function (browser) {
        var page = browser.page.signupPage();
        page
      .navigate()
      .waitForElementVisible('body', 10000);

        browser.element('css selector', '#sidePanelDesktop ul li button', function(result){
            if (result.value && result.value.ELEMENT) {
                browser.page.dashboardPage().click('@logoutButton');
            }
        });

        page
      .assert.urlContains('sign-up')

      .assert.containsText('body', 'First')
      .assert.containsText('body', 'Last')
      .assert.containsText('body', 'Email')
      .assert.containsText('body', 'Password')

      .waitForElementVisible('@firstNameInput', 10000)
      .assert.elementPresent('@firstNameInput')
      .assert.elementPresent('@lastNameInput')
      .assert.elementPresent('@emailInput')
      .assert.elementPresent('@passwordInput')

      .assert.elementPresent('@submitButton')

      .setValue('@firstNameInput', browser.globals.firstName)
      .setValue('@lastNameInput',  browser.globals.lastName)
      .setValue('@emailInput',     browser.globals.email)
      .setValue('@passwordInput',  browser.globals.password)

      .click('@submitButton')

      .waitForElementVisible('@alert', 10000)
      .assert.elementPresent('@alert');

        browser.end();
    }
};
