var utils = require('../helpers/utils.js');

module.exports = {

    'Reelcontent Billing Test': function (browser) {
        utils.login(browser)
      .waitForElementVisible('body', 10000);

        var page = browser.page.billingPage();
        page
      .navigate()
      .waitForElementVisible('@sidePanel', 40000)

      .assert.urlContains('billing');

        utils.allDashboardTest(page);

        utils.logout(browser)

      .end();
    }
};
