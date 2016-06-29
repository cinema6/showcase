module.exports = {

    'Reelcontent Forgot Password Test': function (browser) {
        browser
      .url(browser.launchUrl + '#/forgot-password')
      .waitForElementVisible('body', 1000)
      .assert.urlContains('password')
      .assert.elementPresent('input[type=email]')
      .assert.elementPresent('button[type=submit]')

      .setValue('input[name=email]', 'email@cinema6.com')
      .click('button[type=submit]')

      .pause(1000)

      .assert.elementPresent('div[role=alert]')

      .pause(1000)

      .end();
    }
};
