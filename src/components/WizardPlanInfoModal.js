import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import classnames from 'classnames';
import numeral from 'numeral';
import SelectPlan from '../forms/SelectPlan';
import { get } from 'lodash';

function trialText(length) {
    const denomination = (() => {
        if (length % 7 === 0) {
            return 'week';
        }

        if (length % 30 === 0) {
            return 'month';
        }

        return 'day';
    })();
    const amount = (() => {
        switch (denomination) {
        case 'week':
            return length / 7;
        case 'month':
            return length / 30;
        case 'day':
        default:
            return length;
        }
    })();

    return `${amount} ${denomination}${amount > 1 ? 's' : ''}`;
}

export default class WizardPlanInfoModal extends Component {
    render() {
        const {
            show,
            actionPending,

            trialLength,
            freeViews,
            plans,

            onClose,
            onContinue,
        } = this.props;

        const title = freeViews ?
            `Reach ${numeral(freeViews).format('0,0')} people for FREE` :
            'Reach thousands of people';
        const cta = trialLength ?
            `Get ${trialText(trialLength)} FREE trial` :
            'Continue';
        const midTierPlanId = get(plans, '[1].id');

        return (<Modal show={show} className="trial-modal" onHide={onClose}>
            <Modal.Header className="text-center" closeButton>
                <h1 className="modal-title">{title}</h1>
                {!!trialLength && (
                    <p>Your first {trialText(trialLength)} of advertising is on us</p>
                )}
                {!trialLength && <p>Start promoting your app now</p>}
            </Modal.Header>
            <Modal.Body className="text-center">
                <div className="row">
                    <div className="trail-wrap">
                        <SelectPlan
                            plans={plans}
                            initialValues={midTierPlanId && { plan: midTierPlanId }}
                            formKey="select"
                            onSubmit={({ plan }) => onContinue(plan)}
                            ref={form => (this.form = form)}
                        />
                        <div className="col-sm-12 col-middle text-left">
                            <h3>We Give Your App The Royal Treatment With:</h3>
                            <ul className="checked-feature-list">
                                <li>
                                    <h4>Stunning ad formats</h4>
                                </li>
                                <li>
                                    <h4>Intelligent self-optimizing ads</h4>
                                </li>
                                <li>
                                    <h4>Weekly performance reports</h4>
                                </li>
                                <li>
                                    <h4>Insights into views, clicks, installs &amp; more
                                    </h4>
                                </li>
                            </ul>
                        </div>
                        <div className="clearfix" />
                        <div className="col-md-12 text-center">
                            <Button
                                onClick={() => this.form.submit()}
                                disabled={actionPending}
                                className={classnames('col-xs-12', {
                                    'btn-waiting': actionPending,
                                })}
                                bsSize="lg"
                                bsStyle="danger"
                            >
                                {cta}
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>);
    }
}

WizardPlanInfoModal.propTypes = {
    show: PropTypes.bool.isRequired,
    actionPending: PropTypes.bool.isRequired,

    trialLength: PropTypes.number.isRequired,
    freeViews: PropTypes.number.isRequired,
    plans: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,

    onClose: PropTypes.func.isRequired,
    onContinue: PropTypes.func.isRequired,
};
WizardPlanInfoModal.defaultProps = {
    actionPending: false,
    trialLength: 0,
    freeViews: 0,
};
