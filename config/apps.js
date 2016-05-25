/* global process */

const PRODUCTION = 'production';

export default {
    paymentPlans: [
        {
            id: 'pp-0Ekdsm05KVZ43Aqj',
            price: 50
        }
    ],
    defaultPromotion: process.env.RC_ENV === PRODUCTION ?
        'pro-0aa4Kr06XTg8IexU' : 'pro-0iv5Zh06XFRpmZF_'
};
