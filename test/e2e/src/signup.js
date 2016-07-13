var config = require('../helpers/config.js');

module.exports = {

    'Reelcontent Sign Up Test': function (browser) {
        browser
          
      .url(browser.launchUrl + '#/sign-up')
      .waitForElementVisible('body', 10000)
      .assert.urlContains('sign-up')
      
      .waitForElementVisible('input[name=firstName]', 10000)
      .assert.elementPresent('input[name=firstName]')
      .assert.elementPresent('input[name=lastName]')
      .assert.elementPresent('input[name=email]')
      .assert.elementPresent('input[name=password]')

      .assert.elementPresent('button[type=submit]')

      .setValue('input[name=firstName]', config.firstName)
      .setValue('input[name=lastName]', config.lastName)
      .setValue('input[name=email]', config.email)
      .setValue('input[name=password]', config.password)

      .click('button[type=submit]')

      .waitForElementVisible('div[role=alert]', 10000)
      .assert.elementPresent('div[role=alert]')

      .end();
    }
};
