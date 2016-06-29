var utils = require("../helpers/utils.js")
var config = require("../helpers/config.js")

module.exports = {

  'Reelcontent Sign Up Test': function (browser) {
    browser
      .url(launch_url + '#/sign-up')
      .waitForElementVisible('body', 1000)
      .assert.urlContains('sign-up')

      .assert.elementPresent('input[name=firstName]')
      .assert.elementPresent('input[name=lastName]')
      .assert.elementPresent('input[name=email]')
      .assert.elementPresent('input[name=password]')

      .assert.elementPresent('button[type=submit]')

      .setValue('input[name=firstName]', 'First')
      .setValue('input[name=lastName]', 'Last')
      .setValue('input[name=email]', 'email@cinema6.com')
      .setValue('input[name=password]', 'password')

      .click('button[type=submit]')

      .pause(1000)

      .assert.elementPresent('div[role=alert]')

      .pause(1000)

      .end();
  }
};
