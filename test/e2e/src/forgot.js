var config = require('../helpers/config.js');

module.exports = {

    'Reelcontent Forgot Password Test': function (browser) {
        browser
      .url(browser.launchUrl + '#/forgot-password')
      .waitForElementVisible('body', 10000)
          
      .assert.urlContains('password')
      .assert.elementPresent('input[type=email]')
      .assert.elementPresent('button[type=submit]')

      .setValue('input[name=email]', config.email)
      .click('button[type=submit]')

      .waitForElementVisible('div[role=alert', 10000)

      .assert.elementPresent('div[role=alert]')

      .end();
    }
};
