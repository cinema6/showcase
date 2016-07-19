module.exports = {

    login: function (browser) {
        var page = browser.page.page_object();

        browser
      .url(browser.launchUrl + '#/login')
      .waitForElementVisible('body', 10000);

        page
      .waitForElementVisible('@emailInput', 10000)
      .assert.elementPresent('@emailInput')
      .assert.elementPresent('@passwordInput')
      .setValue('@emailInput', browser.globals.email)
      .setValue('@passwordInput', browser.globals.password)
      .click('@submitButton');

        return browser;
    },

    logout: function (browser) {
        var page = browser.page.page_object();

        page
      .waitForElementVisible('@logoutButton', 10000)
      .assert.elementPresent('@logoutButton')
      .click('@logoutButton');

        return browser;
    },

    allDashboardTest: function (browser) {
        var page = browser.page.page_object();

        page
      .waitForElementVisible('@logo', 10000)
      .assert.elementPresent('@logo')
      .assert.urlContains('dashboard')
      .assert.elementPresent('@dropdown')
      .assert.elementPresent('#sidePanelDesktop')
      .assert.attributeEquals('@dropdown', 'aria-expanded', 'false')
      .click('@dropdown')
      .assert.attributeEquals('@dropdown', 'aria-expanded', 'true')
      .assert.elementPresent('#navbar ul li div ul.dropdown-menu');

        return browser;
    },

    phoneFrameTest: function (browser) {
        return browser
      .assert.elementPresent('div[class=phone-frame');
    }
};
