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

  'Reelcontent Forgot Password Test' : function (browser) {
    browser
    .url('http://localhost:9000/#/forgot-password')
    .waitForElementVisible('body', 1000)
    .assert.urlContains('password')
    .assert.elementPresent('input[type=email]')
    .assert.elementPresent('button[type=submit]')

    .setValue('input[name=email]', 'email@cinema6.com')
    .click('button[type=submit]')

    .pause(1000)

    .assert.elementPresent('div[role=alert]')

    .pause(1000)

    .end();
  },


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

  'Reelcontent Billing Test' : function (browser) {

    login(browser)

    browser
    .pause(3000)
    .waitForElementVisible('body', 1000)
    .url('http://localhost:9000/#/dashboard/billing')

    allDashboardTest(browser)

    browser
    .pause(1000)

    logout(browser)

    browser
    .end();
  },

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
    //.setValue('input[name=phoneNumber]', '(' + (int)(Math.random() * 1000) + ') '
    //+ (int)(Math.random() * 1000) + '-' + (int)(Math.random() * 10000))

    .click('button[type=submit]')

    .pause(1000)

    .waitForElementVisible('div[role=alert]', 2000)
    .assert.elementPresent('div[role=alert]')

    .pause(1000)

    logout(browser)

    browser
    .end();
  },

  'Reelcontent Email Test' : function (browser) {

    login(browser)

    browser
    .pause(3000)
    .waitForElementVisible('body', 1000)
    .url('http://localhost:9000/#/dashboard/account/email')

    allDashboardTest(browser)

    browser
    .pause(1000)

    .assert.elementPresent('input[type=email]')
    .assert.elementPresent('input[type=password]')

    .clearValue('input[name=email]')
    .clearValue('input[name=password]')

    .setValue('input[name=email]', 'email@cinema6.com')
    .setValue('input[name=password]', 'password')
    .click('button[type=submit]')

    .pause(1000)

    .assert.elementPresent('div[role=alert]')

    .pause(1000)

    logout(browser)

    browser
    .end();
  },

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
