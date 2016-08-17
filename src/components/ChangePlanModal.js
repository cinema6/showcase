import React, { PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SelectPlan from '../forms/SelectPlan';
import { find, includes } from 'lodash';
import classnames from 'classnames';

export default function ChangePlanModal({
    show,
    actionPending,

    plans,
    currentPlan: currentPlanId,
    selectedPlan: selectedPlanId,
    amountOfCampaigns,
    cycleEnd,

    onConfirm,
    onCancel,
    onClose,
}) {
    const currentPlan = find(plans, { id: currentPlanId });
    const selectedPlan = find(plans, { id: selectedPlanId });
    const upgrade = (currentPlan && selectedPlan) && (selectedPlan.price > currentPlan.price);
    const tooManyCampaigns = selectedPlan && amountOfCampaigns > selectedPlan.maxCampaigns;
    const initialPlanId = (() => {
        if (!plans || plans.length < 1) {
            return undefined;
        }

        // If the user's current plan is one of the options, preselect it.
        if (includes(plans.map(plan => plan.id), currentPlanId)) {
            return currentPlanId;
        }

        // Otherwise preselect the middle option.
        return plans[Math.floor(plans.length / 2)].id;
    })();

    return (<Modal show={show} className="trial-modal change-plan" onHide={onClose}>
        <Modal.Header className="text-center" closeButton>
            <h1 className="modal-title">Change your plan</h1>
            {cycleEnd && <p>Your billing cycle ends on {cycleEnd.format('MMM DD')}</p>}
        </Modal.Header>
        <Modal.Body className="text-center">
            <div className="row">
                <div className="trail-wrap">
                    <SelectPlan
                        plans={plans}
                        currentPlan={currentPlanId}
                        initialValues={{ plan: initialPlanId }}
                        formKey="change"
                    />
                    <div className="col-sm-12 col-middle text-left">
                        {tooManyCampaigns && <div className="alert alert-warning text-center">
                            <p>You must archive your ads to downgrade to this plan. If you select to
                            downgrade and have more than allowed apps for the selected plan, we will
                            archive the oldest ads for you to be able to downgrade.
                            </p>
                        </div>}

                        {upgrade && <div className="alert alert-success text-center">
                            Upgrade will take effect immediately.
                        </div>}
                    </div>
                    <div className="clearfix">
                    </div>
                    <div className="col-md-12 overflow-wrap text-center">
                        <Button
                            bsSize="lg"
                            bsStyle="danger"
                            className={classnames('col-xs-12', {
                                'btn-waiting': actionPending,
                            })}
                            disabled={actionPending || !plans || plans.length < 1}
                            onClick={() => onConfirm(selectedPlanId)}
                        >
                            Confirm
                        </Button>
                    </div>
                    <br />
                    <div className="col-md-12 text-center cancel-plan">
                        <p>Don't want to run ads anymore?</p>
                        <button className="btn btn-link" onClick={() => onCancel()}>
                            Cancel my plan
                        </button>
                    </div>
                </div>
            </div>
        </Modal.Body>
    </Modal>);
}

ChangePlanModal.propTypes = {
    show: PropTypes.bool.isRequired,
    actionPending: PropTypes.bool.isRequired,

    plans: PropTypes.arrayOf(PropTypes.object),
    currentPlan: PropTypes.string,
    selectedPlan: PropTypes.string,
    amountOfCampaigns: PropTypes.number,
    cycleEnd: PropTypes.shape({
        format: PropTypes.func.isRequired,
    }),

    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

ChangePlanModal.defaultProps = {
    show: false,
    actionPending: false,
};
