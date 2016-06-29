
module.exports = {
    '@disabled': true,

    login: function (browser) {
        return browser
      .url(browser.launchUrl + '#/login')
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('input[type=email]')
      .assert.elementPresent('input[type=password]')
      .setValue('input[name=email]', 'email@cinema6.com')
      .setValue('input[name=password]', 'password')
      .click('button[type=submit]');
    },

    logout: function (browser) {
        return browser
      .url(browser.launchUrl + '#/dashboard/')
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#sidePanelDesktop ul li button')
      .click('#sidePanelDesktop ul li button');
    },

    allDashboardTest: function (browser) {
        return browser
      .assert.elementPresent('img[alt=logo]')
      .assert.elementPresent('a[id=user-management-dropdown]')
      .assert.elementPresent('#sidePanelDesktop')
      .click('a[id=user-management-dropdown]')
      .assert.elementPresent('#navbar ul li div ul.dropdown-menu');
    }
};
