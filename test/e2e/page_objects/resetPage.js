module.exports = {
    url: function() {
        return this.api.launchUrl + '#/dashboard/account/password';
    },
    elements: {
        submitButton: 'button[type=submit]',
        oldPasswordInput: 'input[name=oldPassword',
        newPasswordInput: 'input[name=newPassword]',
        repeatPasswordInput: 'input[name=newPasswordRepeat]',
        alert: 'div[role=alert]'
    }
};
