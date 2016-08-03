import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import numeral from 'numeral';
import classnames from 'classnames';

function formatAppAmountText(amount) {
    return `Promote ${amount} App${amount > 1 ? 's' : ''}`;
}

function SelectPlan({
    plans,
    currentPlan,
    fields: {
        plan: planField,
    },
}) {
    return (<form className="row">
        {plans.map(plan => <div
            key={plan.id}
            className="col-sm-4 col-md-4 col-xs-12 col-middle payment-plan"
        >
            <label htmlFor={plan.id}>
                <input
                    type="radio"
                    name={plan.id}
                    id={plan.id}
                    value={planField.value}
                    onChange={planField.onChange}
                    value={plan.id}
                    checked={plan.id === planField.value}
                />
                <div className="plan-info-box plan-starter">
                    <div className="plan-box-header">
                        <h3>{plan.label}</h3>
                    </div>
                    <div className="plan-box-content">
                        <div className="plan-box-item stacked-item">
                            <h2>{numeral(plan.viewsPerMonth).format('0,0')}</h2>
                            <span>Unique Views</span>
                        </div>
                        <div className="plan-box-item stacked-item">
                            <h3>{numeral(plan.price).format('$0,0.00')}</h3>
                            <span>/mo</span>
                        </div>
                        <div className="plan-box-item stacked-item">
                            <span>{formatAppAmountText(plan.maxCampaigns)}</span>
                        </div>
                        <div className="plan-box-item stacked-item last-item">
                            <span>Real-time Stats</span>
                        </div>
                    </div>
                    <div
                        className={classnames('plan-box-footer', {
                            'current-plan': plan.id === currentPlan,
                            'choose-plan': plan.id !== currentPlan,
                        })}
                    />
                </div>
            </label>
        </div>)}
    </form>);
}

SelectPlan.propTypes = {
    plans: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        viewsPerMonth: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
        maxCampaigns: PropTypes.number.isRequired,
    }).isRequired).isRequired,
    currentPlan: PropTypes.string,

    fields: PropTypes.shape({
        plan: PropTypes.shape({
            value: PropTypes.string.isRequired,
            onChange: PropTypes.func.isRequired,
        }).isRequired,
    }).isRequired,
};

SelectPlan.defaultProps = {
    plans: [],
};

export default reduxForm({
    form: 'selectPlan',
    fields: ['plan'],
    destroyOnUnmount: false,
})(SelectPlan);
