var utils = require('../helpers/utils.js');

module.exports = {

    'Reelcontent Dashboard Test': function (browser) {
        utils.login(browser);
        var page = browser.page.dashboardPage();

        page
      .waitForElementVisible('@sidePanel', 10000)
      .assert.urlContains('dashboard');

        utils.allDashboardTest(page);

        utils.logout(browser)

      .end();
    }
};
