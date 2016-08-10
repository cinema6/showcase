module.exports = {

    allDashboardTest: function (browserPage) {
        return browserPage
      .waitForElementVisible('@logo', 10000)
      .assert.elementPresent('@logo')
      .assert.urlContains('dashboard')
      .assert.elementPresent('@dropdown')
      .assert.elementPresent('@sidePanel')
      .assert.attributeEquals('@dropdown', 'aria-expanded', 'false')
      .click('@dropdown')
      .assert.attributeEquals('@dropdown', 'aria-expanded', 'true')
      .assert.elementPresent('@dropdownMenu');
    }
};
