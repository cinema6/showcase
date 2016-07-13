var utils = require('../helpers/utils.js');

module.exports = {

    'Reelcontent Billing Test': function (browser) {

        utils.login(browser)

      .waitForElementVisible('div[class=phone-frame]', 40000)
      .url(browser.launchUrl + '#/dashboard/billing')

      .waitForElementVisible('#sidePanelDesktop', 100000)

      .assert.urlContains('billing');

        utils.allDashboardTest(browser);

        utils.logout(browser)

      .end();
    }
};
