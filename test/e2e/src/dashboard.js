var utils = require('../helpers/utils.js');

module.exports = {

    'Reelcontent Dashboard Test': function (browser) {

        utils.login(browser)

      .waitForElementVisible('#sidePanelDesktop', 10000)
      .assert.urlContains('dashboard');

        utils.allDashboardTest(browser);

        utils.phoneFrameTest(browser);

        utils.logout(browser)

      .end();
    }
};
