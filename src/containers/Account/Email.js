import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { changeEmail } from '../../actions/account';
import { pageify } from '../../utils/page';
import { compose } from 'redux';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import classnames from 'classnames';

const PAGE_PATH = 'dashboard.account.email';

function tooltip(text, id, placement = 'right') {
    const tip = <Tooltip id={`tooltip--${id}`}>{text}</Tooltip>;
    const trigger = <i className="fa fa-question-circle" aria-hidden="true" />;

    return <OverlayTrigger placement={placement} overlay={tip}>{trigger}</OverlayTrigger>;
}

function onSubmit(values, dispatch) {
    return dispatch(changeEmail(values)).catch(reason => Promise.reject({ _error: reason }))
        .then(() => undefined);
}

export class Email extends Component {
    render() {
        const {
            fields: { email, password },
            handleSubmit, error, pristine, submitting,
            page: { updateSuccess },
            currentEmail
        } = this.props;

        return (<div>
            <div className="col-md-9">
                <h3>Change Email / Username</h3>
            </div>
            <div className="col-md-6">
                <div className="col-md-12">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="inputHelpBlock">
                                Email {tooltip(
                                    `What is your new email? Your current one is ${currentEmail}.`,
                                    'current-email'
                                )}
                            </label>
                            <input {...email} type="text" className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputHelpBlock">
                                Password {tooltip('Your current password.', 'current-password')}
                            </label>
                            <input {...password} type="password" className="form-control" />
                        </div>
                        {updateSuccess && (<div className="alert alert-success" role="alert">
                            <strong>Your email has been updated!</strong>
                        </div>)}
                        {error && !submitting && (<div className="alert alert-danger" role="alert">
                            <strong>Uh-oh!</strong> {error.response}
                        </div>)}
                        <button type="submit"
                            disabled={submitting || pristine}
                            className={classnames('col-md-4 col-xs-12 btn btn-danger btn-lg', {
                                'btn-waiting': submitting
                            })}>
                            Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>);
    }
}

Email.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    error: PropTypes.any,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,

    page: PropTypes.object.isRequired,
    currentEmail: PropTypes.string.isRequired
};

export function mapStateToProps(state) {
    const user = state.db.user[state.session.user];
    const email = (user && user.email) || null;

    return {
        currentEmail: email,
        initialValues: { email }
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
