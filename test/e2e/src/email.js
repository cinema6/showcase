var utils = require('../helpers/utils.js');

module.exports = {

    'Reelcontent Email Test': function (browser) {

        utils.login(browser)

      .waitForElementVisible('body', 1000)
      .waitForElementVisible('div[class=phone-frame]', 10000)
      .url(browser.launchUrl + '#/dashboard/account/email')
      .waitForElementVisible('body', 1000);

        utils.allDashboardTest(browser)
          
      .waitForElementVisible('input[type=email]', 10000)
      .assert.elementPresent('input[type=email]')
      .assert.elementPresent('input[type=password]')

      .clearValue('input[name=email]')
      .clearValue('input[name=password]')

      .setValue('input[name=email]', 'email@cinema6.com')
      .setValue('input[name=password]', 'password')
      .click('button[type=submit]')

      .waitForElementVisible('div[role=alert]', 10000)

      .assert.elementPresent('div[role=alert]');

        utils.logout(browser)

      .end();
    }
};
