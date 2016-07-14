var utils = require('../helpers/utils.js');

module.exports = {

    'Reelcontent Password Reset Test': function (browser) {

        utils.login(browser)

      .waitForElementVisible('body', 10000)
      .url(browser.launchUrl + '#/dashboard/account/password')
      .waitForElementVisible('body', 10000);

        utils.allDashboardTest(browser)

      .waitForElementVisible('input[name=oldPassword]', 10000)
      .assert.elementPresent('input[name=oldPassword]')
      .assert.elementPresent('input[name=newPassword]')
      .assert.elementPresent('input[name=newPasswordRepeat]')

      .clearValue('input[name=oldPassword]')
      .clearValue('input[name=newPassword]')
      .clearValue('input[name=newPasswordRepeat]')

      .setValue('input[name=oldPassword]', browser.globals.password)
      .setValue('input[name=newPassword]', browser.globals.password)
      .setValue('input[name=newPasswordRepeat]', browser.globals.password)
      .click('button[type=submit]')

      .waitForElementVisible('div[role=alert]', 10000)
      .assert.elementPresent('div[role=alert]');

        utils.logout(browser)

      .end();
    }
};

