var utils = require('../helpers/utils.js');

module.exports = {

    'Reelcontent Login / Logout Test': function (browser) {
        browser
      .url(browser.launchUrl)
      .waitForElementVisible('body', 1000)

      .assert.urlContains('login')
      .assert.containsText('body', 'Email')
      .assert.containsText('body', 'Password')
      .assert.containsText('body', 'Login')
      .assert.containsText('body', 'Sign up')

      .assert.elementPresent('input[type=email]')
      .assert.elementPresent('input[type=password]')

      .assert.elementPresent('button[type=submit]')
      .click('button[type=submit]')
      .waitForElementVisible('div[role=alert]', 1000);

        utils.login(browser)

      .pause(3000)

      .waitForElementVisible('body', 1000)
      .assert.urlContains('dashboard')
      .pause(1000)
      .isVisible('nav[id=sidePanelDesktop]', function () {
          return browser
          .assert.elementPresent('#sidePanelDesktop ul li button')
          .click('#sidePanelDesktop ul li button');
      })

      .pause(1000)

      .end();
    }
};
