var utils = require("./utils.js")
var config = require("./config.js")

module.exports = {

  'Reelcontent Billing Test': function (browser) {

    utils.login(browser)

    browser
      .pause(3000)
      .waitForElementVisible('body', 1000)
      .url(config.getUrl() + '#/dashboard/billing')

    utils.allDashboardTest(browser)

    browser
      .pause(1000)

    utils.logout(browser)

    browser
      .end();
  },

};
