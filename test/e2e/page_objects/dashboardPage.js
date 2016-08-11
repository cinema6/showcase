var dashboardCommands = {
    logout: function() {
        return this
        .waitForElementVisible('@logoutButton', 10000)
        .click('@logoutButton');
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
        phoneFrame: 'div[class=phone-frame]',
        replaceButton: 'button.btn-sm',
        deleteButton: 'button.btn:nth-child(2)',
        trackSetup: 'p.text-center > a:nth-child(1)',
        popup: '.modal-content',
        productID: 'input[id=tracking-id]',
        closeButton: '.close'
    }
};
