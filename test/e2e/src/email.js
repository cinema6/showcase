var utils = require('../helpers/utils.js');

module.exports = {

    'Reelcontent Email Test': function (browser) {
        utils.login(browser)
      .waitForElementVisible('body', 10000);

        var page = browser.page.emailPage();
        page
      .navigate()
      .waitForElementVisible('@sidePanel', 10000);

        utils.allDashboardTest(page)

      .waitForElementVisible('@emailInput', 10000)
      .assert.elementPresent('@emailInput')
      .assert.elementPresent('@passwordInput')

      .clearValue('@emailInput')
      .clearValue('@passwordInput')

      .setValue('@emailInput', browser.globals.email)
      .setValue('@passwordInput', browser.globals.password)
      .click('@submitButton')

      .waitForElementVisible('@alert', 40000)

      .assert.elementPresent('@alert');

        utils.logout(browser)

      .end();
    }
};
