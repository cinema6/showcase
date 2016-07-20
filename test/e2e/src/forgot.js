module.exports = {

    'Reelcontent Forgot Password Test': function (browser) {
        var page = browser.page.forgotPage();

        page
      .navigate()
      .waitForElementVisible('body', 10000)
      .assert.urlContains('password')

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
