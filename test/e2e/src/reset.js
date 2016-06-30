var utils = require('../helpers/utils.js');

module.exports = {

    'Reelcontent Password Reset Test': function (browser) {

        utils.login(browser)

      .waitForElementVisible('body', 1000)
      .url(browser.launchUrl + '#/dashboard/account/password')
      .waitForElementVisible('body', 1000);

        utils.allDashboardTest(browser)

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

      .waitForElementVisible('div[role=alert]', 1000)
      .assert.elementPresent('div[role=alert]');

        utils.logout(browser)

      .end();
    }
};

