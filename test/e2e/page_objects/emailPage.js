var emailCommands = {
    logout: function(browser) {
        this
        .waitForElementVisible('@logoutButton', 10000)
        .click('@logoutButton');

        return browser;
    }
};

module.exports = {
    commands: [emailCommands],
    url: function() {
        return this.api.launchUrl + '#/dashboard/account/email';
    },
    elements: {
        emailInput: 'input[type=email]',
        passwordInput: 'input[type=password]',
        submitButton: 'button[type=submit]',
        sidePanel: '#sidePanelDesktop',
        logo: 'img[alt=logo]',
        dropdown: 'a[id=user-management-dropdown]',
        dropdownMenu: '#navbar ul li div ul.dropdown-menu',
        alert: 'div[role=alert]',
        logoutButton: '#sidePanelDesktop ul li button'
    }
};
