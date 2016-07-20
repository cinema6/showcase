var utils = require('../helpers/utils.js');

module.exports = {

    'Reelcontent Email Test': function (browser) {
        var page = browser.page.emailPage();

        utils.login(browser);

        page
      .waitForElementVisible('body', 10000)
      .waitForElementVisible('div[class=phone-frame]', 40000)
      .navigate()
      .waitForElementVisible('body', 10000);

        utils.allDashboardTest(browser);

        page
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
