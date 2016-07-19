module.exports = {

    'Reelcontent Forgot Password Test': function (browser) {
        var page = browser.page.page_object();

        browser
      .url(browser.launchUrl + '#/forgot-password')
      .waitForElementVisible('body', 10000)
          
      .assert.urlContains('password');

        page
      .assert.visible('@emailInput')
      .assert.visible('@submitButton')

      .setValue('@emailInput', browser.globals.email)
      .click('@submitButton')

      .waitForElementVisible('@alert', 10000)

      .assert.visible('@alert');

        browser
      .end();
    }
};
