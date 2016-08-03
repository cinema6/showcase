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

    'Reelcontent Dashboard Test': function (browser) {
        var page = browser.page.dashboardPage();
        page
      .assert.urlContains('dashboard');

        utils.allDashboardTest(page);
    }
};
