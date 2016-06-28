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

  'Reelcontent Sign Up Test' : function (browser) {
    browser
    .url('http://localhost:9000/#/sign-up')
    .waitForElementVisible('body', 1000)
    .assert.urlContains('sign-up')

    .assert.elementPresent('input[name=firstName]')
    .assert.elementPresent('input[name=lastName]')
    .assert.elementPresent('input[name=email]')
    .assert.elementPresent('input[name=password]')

    .assert.elementPresent('button[type=submit]')

    .setValue('input[name=firstName]', 'First')
    .setValue('input[name=lastName]', 'Last')
    .setValue('input[name=email]', 'email@cinema6.com')
    .setValue('input[name=password]', 'password')

    .click('button[type=submit]')

    .pause(1000)

    .assert.elementPresent('div[role=alert]')

    .pause(1000)

    .end();
  },
};
