function login(browser) {
  browser
  .url('http://localhost:9000/#/login')
  .waitForElementVisible('body', 1000)
  .assert.elementPresent('input[type=email]')
  .assert.elementPresent('input[type=password]')
  .setValue('input[name=email]', 'email@cinema6.com')
  .setValue('input[name=password]', 'password')
  .click('button[type=submit]')
}

function logout(browser) {
  browser
  .url('http://localhost:9000/#/dashboard/')
  .waitForElementVisible('body', 1000)
  .assert.elementPresent('#sidePanelDesktop ul li button')
  .click('#sidePanelDesktop ul li button')
}

function allDashboardTest(browser) {
  browser
  .assert.elementPresent('img[alt=logo]')
  .assert.elementPresent('a[id=user-management-dropdown]')
  .assert.elementPresent('#sidePanelDesktop')
  .click('a[id=user-management-dropdown]')
  .assert.elementPresent('#navbar ul li div ul.dropdown-menu')

}

module.exports = {

  'Reelcontent Dashboard Test' : function (browser) {

    login(browser)

    browser
    .pause(3000)
    .waitForElementVisible('body', 1000)
    .assert.urlContains('dashboard')

    allDashboardTest(browser)

    //  .assert.elementPresent('#intercom-launcher div.intercom-launcher-button')
    //  .click('#intercom-launcher div.intercom-launcher-button')
    //  .assert.elementPresent('#intercom-conversation div.intercom-sheet-body')

    browser
    .pause(1000)

    logout(browser)

    browser
    .end();
  },

};
