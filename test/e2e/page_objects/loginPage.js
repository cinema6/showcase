var loginCommands = {
    login: function(browser) {
        this
        .navigate()
        .waitForElementVisible('body', 10000);

        browser.element('css selector', '#sidePanelDesktop ul li button', function(result){
            if (result.value && result.value.ELEMENT) {
                browser.page.dashboardPage().click('@logoutButton');
            }
        });

        return this
        .waitForElementVisible('@emailInput', 10000)
        .setValue('@emailInput',    browser.globals.email)
        .setValue('@passwordInput', browser.globals.password)
        .click('@submitButton')
        .waitForElementVisible('#sidePanelDesktop', 10000);
    }
};

module.exports = {
    commands: [loginCommands],
    url: function() {
        return this.api.launchUrl + '#/login';
    },
    elements: {
        emailInput: 'input[type=email]',
        passwordInput: 'input[type=password]',
        submitButton: 'button[type=submit]',
        alert: 'div[role=alert]'
    }
};
