var utils = require('../helpers/utils.js');

module.exports = {

    'Reelcontent Dashboard Test': function (browser) {
        browser.page.loginPage()
      .login(browser);

        var page = browser.page.dashboardPage();

        page
      .waitForElementVisible('@sidePanel', 10000)
      .assert.urlContains('dashboard');

        utils.allDashboardTest(page)

      .logout();

        browser.end();
    }
};
