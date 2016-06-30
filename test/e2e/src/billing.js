var utils = require('../helpers/utils.js');

module.exports = {

    'Reelcontent Billing Test': function (browser) {

        utils.login(browser)

      .waitForElementVisible('body', 1000)
      .url(browser.launchUrl + '#/dashboard/billing')
      .waitForElementVisible('body', 3000)
      .assert.urlContains('billing');

        utils.allDashboardTest(browser);

        utils.logout(browser)

      .end();
    }
};
