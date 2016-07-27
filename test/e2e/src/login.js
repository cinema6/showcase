var utils = require('../helpers/utils.js');

module.exports = {

    'Reelcontent Login / Logout Test': function (browser) {
        var page = browser.page.loginPage();
        page
      .navigate()
      .waitForElementVisible('body', 10000)
      .waitForElementVisible('@emailInput', 10000)

      .assert.urlContains('login')
      .assert.containsText('body', 'Email')
      .assert.containsText('body', 'Password')
      .assert.containsText('body', 'Login')
      .assert.containsText('body', 'Sign up')

      .assert.elementPresent('@emailInput')
      .assert.elementPresent('@passwordInput')

      .assert.elementPresent('@submitButton')
      .click('@submitButton')
      .waitForElementVisible('@alert', 10000)

      .login(browser);

        page = browser.page.dashboardPage();

        page
      .waitForElementVisible('@sidePanel', 10000)
      .assert.urlContains('dashboard')

      .logout(browser)

      .end();
    }
};
