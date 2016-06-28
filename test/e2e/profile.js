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

  'Reelcontent Profile Test' : function (browser) {

    login(browser)

    browser
    .pause(3000)
    .waitForElementVisible('body', 1000)
    .url('http://localhost:9000/#/dashboard/account/profile')

    allDashboardTest(browser)

    browser
    .assert.elementPresent('input[name=firstName]')
    .assert.elementPresent('input[name=lastName]')
    .assert.elementPresent('input[name=company]')
    .assert.elementPresent('input[name=phoneNumber]')

    .clearValue('input[name=firstName]')
    .clearValue('input[name=lastName]')
    .clearValue('input[name=company]')
    .clearValue('input[name=phoneNumber]')

    .setValue('input[name=firstName]', 'First')
    .setValue('input[name=lastName]', 'Last')
    .setValue('input[name=company]', 'Company')
    .setValue('input[name=phoneNumber]', Math.random() * 10000000000)
    //.setValue('input[name=phoneNumber]', '(' + (int)(Math.random() * 1000) + ') ' + (int)(Math.random() * 1000) + '-' + (int)(Math.random() * 10000))

    .click('button[type=submit]')

    .pause(1000)

    .waitForElementVisible('div[role=alert]', 2000)
    .assert.elementPresent('div[role=alert]')

    .pause(1000)

    logout(browser)

    browser
    .end();
  },

};
