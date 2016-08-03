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

    'Reelcontent Billing Test': function (browser) {
        var page = browser.page.billingPage();
        page
      .navigate()
      .waitForElementVisible('@sidePanel', 40000)

      .assert.urlContains('billing');

        utils.allDashboardTest(page);
    }
};
