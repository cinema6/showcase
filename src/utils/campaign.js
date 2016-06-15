import {
    reject,
    defaultsDeep,
    defaults,
    assign,
    cloneDeep as clone,
    get,
} from 'lodash';
import * as TARGETING from '../enums/targeting';

export function productDataFromCampaign(campaign) {
    return (campaign && clone(campaign.product)) || null;
}

export function targetingFromCampaign(campaign) {
    if (!campaign) { return null; }

    const [gender] = get(campaign, 'targeting.demographics.gender', []);
    const age = get(campaign, 'targeting.demographics.age', []);

    return {
        gender: gender || TARGETING.GENDER.ALL,
        age: age.length > 0 ? age : [TARGETING.AGE.ALL],
    };
}

export function campaignFromData({ productData, targeting }, campaign) {
    const currentTargeting = targetingFromCampaign(campaign);
    const base = defaultsDeep({}, campaign, {
        application: 'showcase',
        cards: [],
        status: 'draft',
        targeting: {
            demographics: {
                age: [],
                gender: [],
            },
            appStoreCategory: [],
        },
    });
    const newTargeting = defaults({}, targeting, currentTargeting);

    return assign({}, base, {
        name: productData.name || base.name,
        product: assign({}, base.product, productData),
        targeting: assign({}, base.targeting, {
            demographics: {
                age: reject(newTargeting.age, age => age === TARGETING.AGE.ALL),
                gender: reject([newTargeting.gender], gender => gender === TARGETING.GENDER.ALL),
            },
            appStoreCategory: productData.categories || base.targeting.appStoreCategory,
        }),
    });
}
