import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { updateUser } from '../../actions/account';
import { pageify } from '../../utils/page';
import { compose } from 'redux';
import classnames from 'classnames';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

const PAGE_PATH = 'dashboard.account.profile';

function onSubmit(values, dispatch) {
    return dispatch(updateUser(values)).catch(reason => Promise.reject({ _error: reason }))
        .then(() => undefined);
}

function tooltip(text, id, placement = 'right') {
    const tip = <Tooltip id={`tooltip--${id}`}>{text}</Tooltip>;
    const trigger = <i className="fa fa-question-circle" aria-hidden="true" />;

    return <OverlayTrigger placement={placement} overlay={tip}>{trigger}</OverlayTrigger>;
}

export class Profile extends Component {
    render() {
        const {
            fields: { firstName, lastName, company, phoneNumber },
            handleSubmit, error, submitting, pristine,
            page: { updateSuccess }
        } = this.props;

        return (<div>
            <div className="col-md-9">
                <h3>Update Profile</h3>
            </div>
            <div className="col-md-6">
                <div className="col-md-12">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="inputHelpBlock">
                                First Name {tooltip('Enter your first name.', 'first-name')}
                            </label>
                            <input {...firstName} type="text" className="form-control" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputHelpBlock">
                                Last Name {tooltip('Enter your last name.', 'last-name')}
                            </label>
                            <input {...lastName} type="text" className="form-control" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputHelpBlock">
                                Company {tooltip(
                                    'Enter the name of your company, if applicable.',
                                    'company'
                                )}
                            </label>
                            <input {...company} type="text" className="form-control" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputHelpBlock">
                                Phone Number {tooltip('Enter your phone number.', 'phone')}
                            </label>
                            <input {...phoneNumber} type="text" className="form-control" />
                        </div>
                        {updateSuccess && (<div className="alert alert-success" role="alert">
                            <strong>Your account has been updated!</strong>
                        </div>)}
                        {error && !submitting && (<div className="alert alert-danger" role="alert">
                            <strong>Uh-oh!</strong> {error.response}
                        </div>)}
                        <button type="submit"
                            disabled={submitting || pristine}
                            className={classnames('col-md-5 col-xs-12 btn btn-danger btn-lg', {
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

Profile.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    error: PropTypes.instanceOf(Error),
    submitting: PropTypes.bool.isRequired,
    page: PropTypes.object.isRequired,
    pristine: PropTypes.bool.isRequired
};

export function mapStateToProps(state) {
    return {
        initialValues: state.db.user[state.session.user] || {}
    };
}

export default compose(
    reduxForm({
        form: 'accountProfile',
        fields: ['firstName', 'lastName', 'company', 'phoneNumber'],
        onSubmit
    }, mapStateToProps),
    pageify({ path: PAGE_PATH })
)(Profile);
