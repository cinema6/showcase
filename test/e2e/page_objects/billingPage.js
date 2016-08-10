module.exports = {
    url: function() {
        return this.api.launchUrl + '#/dashboard/billing';
    },
    elements: {
        logo: 'img[alt=logo]',
        sidePanel: '#sidePanelDesktop',
        dropdown: 'a[id=user-management-dropdown]',
        dropdownMenu: '#navbar ul li div ul.dropdown-menu',
        logoutButton: '#sidePanelDesktop ul li button'
    }
};
