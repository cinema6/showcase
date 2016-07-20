module.exports = {
    url: function() {
        return this.api.launchUrl + '#/dashboard';
    },
    elements: {
        logo: 'img[alt=logo]',
        dropdown: 'a[id=user-management-dropdown]',
        logoutButton: '#sidePanelDesktop ul li button'
    }
};
