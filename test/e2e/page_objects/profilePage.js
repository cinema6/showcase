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
        alert: 'div[role=alert]'
    }
};
