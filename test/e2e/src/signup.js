module.exports = {

    'Reelcontent Sign Up Test': function (browser) {
        var page = browser.page.page_object();

        browser
      .url(browser.launchUrl + '#/sign-up')
      .waitForElementVisible('body', 10000)
      .assert.urlContains('sign-up');

        page
      .waitForElementVisible('@firstNameInput', 10000)
      .assert.elementPresent('@firstNameInput')
      .assert.elementPresent('@lastNameInput')
      .assert.elementPresent('@emailInput')
      .assert.elementPresent('@passwordInput')

      .assert.elementPresent('@submitButton')

      .setValue('@firstNameInput', browser.globals.firstName)
      .setValue('@lastNameInput', browser.globals.lastName)
      .setValue('@emailInput', browser.globals.email)
      .setValue('@passwordInput', browser.globals.password)

      .click('@submitButton')

      .waitForElementVisible('@alert', 10000)
      .assert.elementPresent('@alert');

        browser
      .end();
    }
};
