var utils = require('../helpers/utils.js');

module.exports = {

    'Reelcontent Password Reset Test': function (browser) {
        var page = browser.page.resetPage();

        utils.login(browser);

        page
      .waitForElementVisible('body', 10000)
      .navigate()
      .waitForElementVisible('body', 10000);

        utils.allDashboardTest(browser);
      
        page
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
      .assert.elementPresent('@alert');

        utils.logout(browser)

      .end();
    }
};
