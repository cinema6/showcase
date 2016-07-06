module.exports = {

    login: function (browser) {
        return browser
      .url(browser.launchUrl + '#/login')
      .waitForElementVisible('body', 10000)
      .waitForElementVisible('input[type=email]', 10000)
      .assert.elementPresent('input[type=email]')
      .assert.elementPresent('input[type=password]')
      .setValue('input[name=email]', 'email@cinema6.com')
      .setValue('input[name=password]', 'password')
      .click('button[type=submit]');
    },

    logout: function (browser) {
        return browser
      .url(browser.launchUrl + '#/dashboard/')
      .waitForElementVisible('#sidePanelDesktop ul li button', 1000)
      .assert.elementPresent('#sidePanelDesktop ul li button')
      .click('#sidePanelDesktop ul li button');
    },

    allDashboardTest: function (browser) {
        return browser
      .waitForElementVisible('img[alt=logo]', 10000)
      .assert.elementPresent('img[alt=logo]')
      .assert.elementPresent('a[id=user-management-dropdown]')
      .assert.elementPresent('#sidePanelDesktop')
      .assert.attributeEquals('a[id=user-management-dropdown]', 'aria-expanded', 'false')
      .click('a[id=user-management-dropdown]')
      .assert.attributeEquals('a[id=user-management-dropdown]', 'aria-expanded', 'true')
      .assert.elementPresent('#navbar ul li div ul.dropdown-menu');
    }
};
