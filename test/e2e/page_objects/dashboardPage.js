var dashboardCommands = {
    logout: function(browser) {
        this
        .waitForElementVisible('@logoutButton', 10000)
        .click('@logoutButton');

        return browser;
    }
};

module.exports = {
    commands: [dashboardCommands],
    url: function() {
        return this.api.launchUrl + '#/dashboard';
    },
    elements: {
        logo: 'img[alt=logo]',
        dropdown: 'a[id=user-management-dropdown]',
        dropdownMenu: '#navbar ul li div ul.dropdown-menu',
        logoutButton: '#sidePanelDesktop ul li button',
        sidePanel: '#sidePanelDesktop',
        phoneFrame: 'div[class=phone-frame]'
    }
};
