var utils = require("./utils.js")
var config = require("./config.js")

module.exports = {

  'Reelcontent Dashboard Test': function (browser) {

    utils.login(browser)

    browser
      .pause(3000)
      .waitForElementVisible('body', 1000)
      .assert.urlContains('dashboard')

    utils.allDashboardTest(browser)
    browser
      .pause(1000)

    utils.logout(browser)

    browser
      .end();
  },

};
