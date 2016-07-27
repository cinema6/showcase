var utils = require('../helpers/utils.js');

module.exports = {

    'Reelcontent Password Reset Test': function (browser) {
        browser.page.loginPage()
      .login(browser)
      .waitForElementVisible('body', 10000);

        var page = browser.page.resetPage();
        page
      .navigate()
      .waitForElementVisible('body', 10000);

        utils.allDashboardTest(page)

      .assert.containsText('body', 'Current Password')
      .assert.containsText('body', 'New Password')
      .assert.containsText('body', 'Confirm')

      .waitForElementVisible('@oldPasswordInput', 10000)
      .assert.elementPresent('@oldPasswordInput')
      .assert.elementPresent('@newPasswordInput')
      .assert.elementPresent('@repeatPasswordInput')

      .clearValue('@oldPasswordInput')
      .clearValue('@newPasswordInput')
      .clearValue('@repeatPasswordInput')

      .setValue('@oldPasswordInput', browser.globals.password)
      .setValue('@newPasswordInput', browser.globals.password)
      .setValue('@repeatPasswordInput', browser.globals.password)
      .click('@submitButton')

      .waitForElementVisible('@alert', 10000)
      .assert.elementPresent('@alert')

      .logout(browser)

      .end();
    }
};
