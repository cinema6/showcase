import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { changeEmail } from '../../actions/account';
import { pageify } from '../../utils/page';
import { compose } from 'redux';

const PAGE_PATH = 'dashboard.account.email';

function onSubmit(values, dispatch) {
    return dispatch(changeEmail(values)).catch(reason => Promise.reject({ _error: reason }))
        .then(() => undefined);
}

export class Email extends Component {
    render() {
        const {
            fields: { email, password },
            handleSubmit, error,
            page: { updateSuccess },
            currentEmail
        } = this.props;

        return (
            <form onSubmit={handleSubmit}>
                <div>Current Email: {currentEmail}</div>
                <div><label>New Email:</label><input type="text" {...email} /></div>
                <div><label>Password:</label><input type="password" {...password} /></div>
                <div><button type="submit">Change Email</button></div>

                {error && (<div>{error.response}</div>)}
                {updateSuccess && (<div>Successfully changed email!</div>)}
            </form>
        );
    }
}

Email.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    error: PropTypes.any,
    page: PropTypes.object.isRequired,
    currentEmail: PropTypes.string.isRequired
};

export function mapStateToProps(state) {
    const user = state.db.users[state.session.user];

    return {
        currentEmail: (user && user.email) || null
    };
}

export default compose(
    reduxForm({
        form: 'accountEmail',
        fields: ['email', 'password'],
        onSubmit
    }, mapStateToProps),
    pageify({ path: PAGE_PATH })
)(Email);
