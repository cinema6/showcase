module.exports = {
    url: function() {
        return this.api.launchUrl + '#/dashboard/account/profile';
    },
    elements: {
        submitButton: 'button[type=submit]',
        firstNameInput: 'input[name=firstName]',
        lastNameInput: 'input[name=lastName]',
        companyInput: 'input[name=company]',
        phoneNumberInput: 'input[name=phoneNumber]',
        dropdown: 'a[id=user-management-dropdown]',
        dropdownMenu: '#navbar ul li div ul.dropdown-menu',
        sidePanel: '#sidePanelDesktop',
        logo: 'img[alt=logo]',
        alert: 'div[role=alert]',
        logoutButton: '#sidePanelDesktop ul li button'
    }
};
