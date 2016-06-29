var utils = require('../helpers/utils.js');

module.exports = {

    'Reelcontent Dashboard Test': function (browser) {

        utils.login(browser)

      .pause(3000)
      .waitForElementVisible('body', 1000)
      .assert.urlContains('dashboard');

        utils.allDashboardTest(browser)

      .pause(1000);

        utils.logout(browser)

      .end();
    }
};
