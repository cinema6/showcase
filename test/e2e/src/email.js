var utils = require('../helpers/utils.js');

module.exports = {

    before: function (browser) {
        browser.page.loginPage()
        .login(browser);
    },

    after: function (browser) {
        browser.page.dashboardPage().logout();
        browser.end();
    },

    'Reelcontent Email Test': function (browser) {
        var page = browser.page.emailPage();
        page
      .navigate()
      .waitForElementVisible('@emailInput', 10000);

        utils.allDashboardTest(page)

      .assert.containsText('body', 'Email')
      .assert.containsText('body', 'Password')

      .assert.elementPresent('@emailInput')
      .assert.elementPresent('@passwordInput')

      .clearValue('@emailInput')
      .clearValue('@passwordInput')

      .setValue('@emailInput',    browser.globals.email)
      .setValue('@passwordInput', browser.globals.password)
      .click('@submitButton')

      .waitForElementVisible('@alert', 40000)
      .assert.elementPresent('@alert');
    }
};
