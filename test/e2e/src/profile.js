var utils = require('../helpers/utils.js');

module.exports = {

    'Reelcontent Profile Test': function (browser) {

        utils.login(browser)

      .waitForElementVisible('body', 1000)
      .waitForElementVisible('div[class=phone-frame]', 10000)
      .url(browser.launchUrl + '#/dashboard/account/profile')
      .waitForElementVisible('body', 10000);

        utils.allDashboardTest(browser)

      .waitForElementVisible('input[name=firstName]', 10000)
      .assert.elementPresent('input[name=firstName]')
      .assert.elementPresent('input[name=lastName]')
      .assert.elementPresent('input[name=company]')
      .assert.elementPresent('input[name=phoneNumber]')

      .clearValue('input[name=firstName]')
      .clearValue('input[name=lastName]')
      .clearValue('input[name=company]')
      .clearValue('input[name=phoneNumber]')

      .setValue('input[name=firstName]', 'First')
      .setValue('input[name=lastName]', 'Last')
      .setValue('input[name=company]', 'Company')
      .setValue('input[name=phoneNumber]',
        '(' + Math.round(Math.random() * 1000) + ') '
        + Math.round(Math.random() * 1000) + '-'
        + Math.round(Math.random() * 10000))

      .click('button[type=submit]')

      .waitForElementVisible('div[role=alert]', 10000)
      .assert.elementPresent('div[role=alert]');

        utils.logout(browser)

      .end();
    }
};

