import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { updateUser } from '../../actions/account';
import { pageify } from '../../utils/page';
import { compose } from 'redux';

const PAGE_PATH = 'dashboard.account.profile';

function onSubmit(values, dispatch) {
    return dispatch(updateUser(values)).catch(reason => Promise.reject({ _error: reason }))
        .then(() => undefined);
}

export class Profile extends Component {
    render() {
        const {
            fields: { firstName, lastName, company },
            handleSubmit, error,
            page: { updateSuccess }
        } = this.props;

        return (
            <form onSubmit={handleSubmit}>
                <div><label>First Name</label><input type="text" {...firstName} /></div>
                <div><label>Last Name</label><input type="text" {...lastName} /></div>
                <div><label>Company</label><input type="text" {...company} /></div>
                <div><button type="submit">Update Account</button></div>

                {error && (<div>{error.response}</div>)}
                {updateSuccess && (<div>Successfully updated account!</div>)}
            </form>
        );
    }
}

Profile.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    error: PropTypes.any,
    page: PropTypes.object.isRequired
};

export function mapStateToProps(state) {
    return {
        initialValues: state.db.users[state.session.user] || {}
    };
}

export default compose(
    reduxForm({
        form: 'accountProfile',
        fields: ['firstName', 'lastName', 'company'],
        onSubmit
    }, mapStateToProps),
    pageify({ path: PAGE_PATH })
)(Profile);
