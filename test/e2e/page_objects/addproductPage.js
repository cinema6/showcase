module.exports = {
    url: function() {
        return this.api.launchUrl + '#/dashboard/addproduct';
    },
    elements: {
        logo: 'img[alt=logo]',
        dropdown: 'a[id=user-management-dropdown]',
        dropdownMenu: '#navbar ul li div ul.dropdown-menu',
        logoutButton: '#sidePanelDesktop ul li button',
        sidePanel: '#sidePanelDesktop',
        phoneFrame: 'div[class=phone-frame]',
        submitButton: 'button[type=submit]',
        step1: '.progressbar-step-1',
        step2: '.progressbar-step-2',
        step3: '.progressbar-step-3',
        step4: '.progressbar-step-4',
        searchInput: 'input[type=text]',
        firstResult:
          'li.app-results:nth-child(1) > span:nth-child(1) > div:nth-child(1) > img:nth-child(1)',
        titleInput: 'input[id=adTitle-input]',
        descriptionInput: 'textarea[id=adDesc-textarea]',
        appCategories: 'h4[class=app-categories]',
        searching: 'app-results app-searching'
    }
};
