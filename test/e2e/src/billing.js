var utils = require('../helpers/utils.js');

module.exports = {

    'Reelcontent Billing Test': function (browser) {
        var page = browser.page.billingPage();

        utils.login(browser);

        page
      .waitForElementVisible('div[class=phone-frame]', 40000)
      .navigate()

      .waitForElementVisible('#sidePanelDesktop', 100000)

      .assert.urlContains('billing');

        utils.allDashboardTest(browser);

        utils.logout(browser)

      .end();
    }
};
