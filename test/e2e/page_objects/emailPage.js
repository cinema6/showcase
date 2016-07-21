module.exports = {
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
        alert: 'div[role=alert]'
    }
};
