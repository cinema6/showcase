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
      .assert.urlContains('dashboard')
      .assert.elementPresent('@trackSetup')
      .click('@trackSetup')
      .waitForElementPresent('@popup', 10000)
      .assert.elementPresent('@productID');
        browser.pause(200);
        page
      .assert.elementPresent('@closeButton')
      .click('@closeButton')
      .waitForElementNotPresent('@popup', 10000);

        utils.allDashboardTest(page);
    }
};
