module.exports = {
    url: function() {
        return this.api.launchUrl + '#/dashboard/account/password';
    },
    elements: {
        submitButton: 'button[type=submit]',
        oldPasswordInput: 'input[name=oldPassword',
        newPasswordInput: 'input[name=newPassword]',
        repeatPasswordInput: 'input[name=newPasswordRepeat]',
        dropdown: 'a[id=user-management-dropdown]',
        dropdownMenu: '#navbar ul li div ul.dropdown-menu',
        sidePanel: '#sidePanelDesktop',
        logo: 'img[alt=logo]',
        alert: 'div[role=alert]',
        logoutButton: '#sidePanelDesktop ul li button'
    }
};
