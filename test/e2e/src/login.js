module.exports = {

    before: function (browser) {
        var page = browser.page.loginPage();
        page
        .navigate()
        .waitForElementVisible('body', 10000);

        browser.element('css selector', '#sidePanelDesktop ul li button', function(result){
            if (result.value && result.value.ELEMENT) {
                browser.page.dashboardPage().click('@logoutButton');
            }
        });
    },

    after: function (browser) {
        browser.page.dashboardPage().logout();
        browser.end();
    },

    'Reelcontent Login / Logout Test': function (browser) {
        var page = browser.page.loginPage();
        page
      .waitForElementVisible('@emailInput', 10000)

      .assert.urlContains('login')
      .assert.containsText('body', 'Email')
      .assert.containsText('body', 'Password')
      .assert.containsText('body', 'Login')
      .assert.containsText('body', 'Sign up')

      .assert.elementPresent('@emailInput')
      .assert.elementPresent('@passwordInput')

      .assert.elementPresent('@submitButton')
      .click('@submitButton')
      .waitForElementVisible('@alert', 10000)

      .login(browser);

        page = browser.page.dashboardPage();

        page
      .assert.urlContains('dashboard');
    }
};
