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

  'Reelcontent Password Test' : function (browser) {

    login(browser)

    browser
    .pause(3000)
    .url('http://localhost:9000/#/dashboard/account/password')
    .waitForElementVisible('body', 1000)

    allDashboardTest(browser)

    browser
    .pause(1000)

    .assert.elementPresent('input[name=oldPassword]')
    .assert.elementPresent('input[name=newPassword]')
    .assert.elementPresent('input[name=newPasswordRepeat]')

    .clearValue('input[name=oldPassword]')
    .clearValue('input[name=newPassword]')
    .clearValue('input[name=newPasswordRepeat]')

    .setValue('input[name=oldPassword]', 'password')
    .setValue('input[name=newPassword]', 'password12345')
    .setValue('input[name=newPasswordRepeat]', 'password12345')
    .click('button[type=submit]')

    .pause(1000)

    .assert.elementPresent('div[role=alert]')

    .pause(1000)

    logout(browser)

    browser
    .end();
  },

};
