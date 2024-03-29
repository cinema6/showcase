module.exports = {
    //'@disabled': true,

    before: function (browser) {
        var page = browser.page.loginPage();
        page.login(browser);

        browser.element('css selector', 'button.btn-sm', function(result){
            if (result.value && result.value.ELEMENT) {
                browser.page.dashboardPage()
              .waitForElementVisible('@replaceButton', 10000)
              .assert.elementPresent('@phoneFrame')
              .assert.elementPresent('@replaceButton')
              .click('@replaceButton');

                browser.pause(15000);

                browser.page.dashboardPage()
              .waitForElementVisible('@deleteButton', 10000)
              .assert.elementPresent('@deleteButton')
              .click('@deleteButton');
            }
        });
    },

    after: function (browser) {
        browser.page.dashboardPage().logout();

        browser.end();
    },

    'Reelcontent Add Product Test - Search': function (browser) {
        var app = browser.globals.app;
        var page = browser.page.addproductPage();
        page
      .waitForElementPresent('@step1', 10000)

      .assert.elementPresent('@step1')
      .assert.elementPresent('@step2')
      .assert.elementPresent('@step3')
      .assert.elementPresent('@step4')

      .assert.elementPresent('@searchInput')
      .setValue('@searchInput', app)
      .waitForElementNotPresent('@searching', 10000)
      .waitForElementPresent('@firstResult', 10000);

        browser.pause(1500);

        page
      .click('@firstResult')

      .assert.elementPresent('@submitButton')
      .click('@submitButton');
    },

    'Reelcontent Add Product Test - Create': function (browser) {
        var page = browser.page.addproductPage();
        page
      .waitForElementPresent('@titleInput', 10000)

      .assert.elementPresent('@step1')
      .assert.elementPresent('@step2')
      .assert.elementPresent('@step3')
      .assert.elementPresent('@step4')

      .assert.elementPresent('@titleInput')
      .assert.elementPresent('@descriptionInput')

      .assert.elementPresent('@phoneFrame')

      .assert.elementPresent('@submitButton')
      .click('@submitButton');
    },

    'Reelcontent Add Product Test - Target': function (browser) {
        var page = browser.page.addproductPage();
        page
      .waitForElementPresent('@appCategories', 10000)

      .assert.elementPresent('@step1')
      .assert.elementPresent('@step2')
      .assert.elementPresent('@step3')
      .assert.elementPresent('@step4')

      .assert.elementPresent('@appCategories')

      .assert.elementPresent('@phoneFrame')

      .assert.elementPresent('@submitButton')
      .click('@submitButton');
    },

    'Reelcontent Add Product Test - Logout': function (browser) {
        var page = browser.page.dashboardPage();
        page

      .waitForElementVisible('@replaceButton', 10000)
      .assert.elementPresent('@phoneFrame')
      .assert.elementPresent('@replaceButton')
      .click('@replaceButton');

        browser.pause(15000);

        page
      .waitForElementVisible('@deleteButton', 10000)
      .assert.elementPresent('@deleteButton')
      .click('@deleteButton');
    }
};
