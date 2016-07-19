var utils = require('../helpers/utils.js');

module.exports = {

    'Reelcontent Profile Test': function (browser) {
        var page = browser.page.page_object();

        utils.login(browser)

      .waitForElementVisible('body', 10000)
      .waitForElementVisible('div[class=phone-frame]', 10000)
      .url(browser.launchUrl + '#/dashboard/account/profile')
      .waitForElementVisible('body', 10000);

        utils.allDashboardTest(browser);
      
        page
      .waitForElementVisible('@firstNameInput', 10000)
      .assert.elementPresent('@firstNameInput')
      .assert.elementPresent('@lastNameInput')
      .assert.elementPresent('@companyInput')
      .assert.elementPresent('@phoneNumberInput')

      .clearValue('@firstNameInput')
      .clearValue('@lastNameInput')
      .clearValue('@companyInput')
      .clearValue('@phoneNumberInput')

      .setValue('@firstNameInput', browser.globals.firstName)
      .setValue('@lastNameInput', browser.globals.lastName)
      .setValue('@companyInput', browser.globals.company)
      .setValue('@phoneNumberInput',
        '(' + Math.round(Math.random() * 1000) + ') '
        + Math.round(Math.random() * 1000) + '-'
        + Math.round(Math.random() * 10000))

      .click('@submitButton')

      .waitForElementVisible('@alert', 10000)
      .assert.elementPresent('@alert');

        utils.logout(browser)

      .end();
    }
};
