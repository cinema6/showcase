var utils = require('../helpers/utils.js');

module.exports = {

    'Reelcontent Email Test': function (browser) {

        utils.login(browser)

      .waitForElementVisible('body', 1000)
      .url(browser.launchUrl + '#/dashboard/account/email')
      .waitForElementVisible('body', 1000);

        utils.allDashboardTest(browser)

      .assert.elementPresent('input[type=email]')
      .assert.elementPresent('input[type=password]')

      .clearValue('input[name=email]')
      .clearValue('input[name=password]')

      .setValue('input[name=email]', 'email@cinema6.com')
      .setValue('input[name=password]', 'password')
      .click('button[type=submit]')

      .waitForElementVisible('div[role=alert]', 1000)

      .assert.elementPresent('div[role=alert]');

        utils.logout(browser)

      .end();
    }
};
