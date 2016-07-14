var utils = require('../helpers/utils.js');

module.exports = {

    'Reelcontent Email Test': function (browser) {

        utils.login(browser)

      .waitForElementVisible('body', 10000)
      .waitForElementVisible('div[class=phone-frame]', 40000)
      .url(browser.launchUrl + '#/dashboard/account/email')
      .waitForElementVisible('body', 10000);

        utils.allDashboardTest(browser)
          
      .waitForElementVisible('input[type=email]', 10000)
      .assert.elementPresent('input[type=email]')
      .assert.elementPresent('input[type=password]')

      .clearValue('input[name=email]')
      .clearValue('input[name=password]')

      .setValue('input[name=email]', browser.globals.email)
      .setValue('input[name=password]', browser.globals.password)
      .click('button[type=submit]')

      .waitForElementVisible('div[role=alert]', 40000)

      .assert.elementPresent('div[role=alert]');

        utils.logout(browser)

      .end();
    }
};
