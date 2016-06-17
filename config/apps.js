/* global process */

const PRODUCTION = 'production';

export default {
    paymentPlans: [
        {
            id: 'pp-0Ekdsm05KVZ43Aqj',
            price: 50,
            viewsPerDay: 70
        }
    ],
    defaultPromotion: process.env.RC_ENV === PRODUCTION ?
        'pro-0aa4Kr06XTg8IexU' : 'pro-0iv5Zh06XFRpmZF_',
    adWords: {
        conversionID: 926037221,
        conversionLabel: 'L5MhCKO_m2cQ5enIuQM'
    }
};
