module.exports = {
    email:     'email@cinema6.com',
    password:  'bananas4bananas',
    firstName: 'Johnny',
    lastName:  'Testmonkey',
    company:   'Company',
    app:       'Pokémon GO',

    beforeEach: function (browser) {
        browser.url(browser.launchUrl);
        browser.waitForElementVisible('body', 10000);

        browser.element('css selector', '#sidePanelDesktop ul li button', function(result){
            if (result.value && result.value.ELEMENT) {
                browser.page.dashboardPage().click('@logoutButton');
            }
        });
    }
};
