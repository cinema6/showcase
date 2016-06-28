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

  'Reelcontent Login / Logout Test' : function (browser) {
    browser
    .url('http://localhost:9000')
    .waitForElementVisible('body', 1000)

    .assert.urlContains('login')
    .assert.containsText('body', 'Email')
    .assert.containsText('body', 'Password')
    .assert.containsText('body', 'Login')
    .assert.containsText('body', 'Sign up')

    .assert.elementPresent('input[type=email]')
    .assert.elementPresent('input[type=password]')

    .assert.elementPresent('button[type=submit]')
    .click('button[type=submit]')
    .waitForElementVisible('div[role=alert]', 1000)

    login(browser)

    browser
    .pause(3000)

    .waitForElementVisible('body', 1000)
    .assert.urlContains('dashboard')
    .pause(1000)
    .isVisible('nav[id=sidePanelDesktop]', function() {
      browser
      .assert.elementPresent('#sidePanelDesktop ul li button')
      .click('#sidePanelDesktop ul li button')
    })

    browser
    .pause(1000)

    .end();
  },

};
