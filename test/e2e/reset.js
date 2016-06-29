var utils = require("./utils.js")
var config = require("./config.js")

module.exports = {

  'Reelcontent Password Test': function (browser) {

    utils.login(browser)

    browser
      .pause(3000)
      .url(config.getUrl() + '#/dashboard/account/password')
      .waitForElementVisible('body', 1000)

    utils.allDashboardTest(browser)

    browser
      .pause(1000)

      .assert.elementPresent('input[name=oldPassword]')
      .assert.elementPresent('input[name=newPassword]')
      .assert.elementPresent('input[name=newPasswordRepeat]')

      .clearValue('input[name=oldPassword]')
      .clearValue('input[name=newPassword]')
      .clearValue('input[name=newPasswordRepeat]')

      .setValue('input[name=oldPassword]', 'password')
      .setValue('input[name=newPassword]', 'password12345')
      .setValue('input[name=newPasswordRepeat]', 'password12345')
      .click('button[type=submit]')

      .pause(1000)

      .assert.elementPresent('div[role=alert]')

      .pause(1000)

    utils.logout(browser)

    browser
      .end();
  },

};
