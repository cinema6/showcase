var utils = require('../helpers/utils.js');

module.exports = {

    'Reelcontent Billing Test': function (browser) {

        utils.login(browser)

      .pause(3000)
      .waitForElementVisible('body', 1000)
      .url(browser.launchUrl + '#/dashboard/billing');

        utils.allDashboardTest(browser)

      .pause(1000);

        utils.logout(browser)

      .end();
    }
};
