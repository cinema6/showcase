var utils = require("./utils.js")

module.exports = {

  'Reelcontent Billing Test': function (browser) {

    utils.login(browser)

    browser
      .pause(3000)
      .waitForElementVisible('body', 1000)
      .url('http://localhost:9000/#/dashboard/billing')

    utils.allDashboardTest(browser)

    browser
      .pause(1000)

    utils.logout(browser)

    browser
      .end();
  },

};
