module.exports = {

    login: function (browser) {
        var page = browser.page.loginPage();

        page
      .navigate()
      .waitForElementVisible('body', 10000)

      .waitForElementVisible('@emailInput', 10000)
      .assert.elementPresent('@emailInput')
      .assert.elementPresent('@passwordInput')
      .setValue('@emailInput', browser.globals.email)
      .setValue('@passwordInput', browser.globals.password)
      .click('@submitButton');

        return browser;
    },

    logout: function (browser) {
        var page = browser.page.dashboardPage();

        page
      .waitForElementVisible('@logoutButton', 10000)
      .assert.elementPresent('@logoutButton')
      .click('@logoutButton');

        return browser;
    },

    allDashboardTest: function (browserPage) {
        var page = browserPage;

        page
      .waitForElementVisible('@logo', 10000)
      .assert.elementPresent('@logo')
      .assert.urlContains('dashboard')
      .assert.elementPresent('@dropdown')
      .assert.elementPresent('@sidePanel')
      .assert.attributeEquals('@dropdown', 'aria-expanded', 'false')
      .click('@dropdown')
      .assert.attributeEquals('@dropdown', 'aria-expanded', 'true')
      .assert.elementPresent('@dropdownMenu');

        return page;
    },

    phoneFrameTest: function (browserPage) {
        var page = browserPage;

        page
      .assert.elementPresent('@phoneFrame');

        return page;

    }
};
