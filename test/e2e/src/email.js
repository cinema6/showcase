var utils = require("../helpers/utils.js")
var config = require("../helpers/config.js")

module.exports = {

  'Reelcontent Email Test': function (browser) {

    utils.login(browser)

      .pause(3000)
      .waitForElementVisible('body', 1000)
      .url(launch_url + '#/dashboard/account/email')

    utils.allDashboardTest(browser)

      .pause(1000)

      .assert.elementPresent('input[type=email]')
      .assert.elementPresent('input[type=password]')

      .clearValue('input[name=email]')
      .clearValue('input[name=password]')

      .setValue('input[name=email]', 'email@cinema6.com')
      .setValue('input[name=password]', 'password')
      .click('button[type=submit]')

      .pause(1000)

      .assert.elementPresent('div[role=alert]')

      .pause(1000)

    utils.logout(browser)

      .end();
  }
};
