var utils = require('../helpers/utils.js');

module.exports = {

    'Reelcontent Dashboard Test': function (browser) {

        utils.login(browser)

      .waitForElementVisible('div[class=phone-frame]', 40000)
      .assert.urlContains('dashboard');

        utils.allDashboardTest(browser);

        utils.logout(browser)

      .end();
    }
};
