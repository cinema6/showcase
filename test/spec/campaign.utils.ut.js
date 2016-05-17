'use strict';

import { campaignFromData, productDataFromCampaign, targetingFromCampaign } from '../../src/utils/campaign';
import * as TARGETING from '../../src/enums/targeting';
import { createUuid } from 'rc-uuid';
import { cloneDeep as clone, assign } from 'lodash';

describe('campaign utils', function() {
    describe('campaignFromData({ productData, targeting }, [campaign])', function() {
        let productData, targeting;
        let result;

        beforeEach(function() {
            productData = {
                type: 'app',
                platform: 'iOS',
                name: 'Scybot Coin Counter',
                description: 'This is a great app!',
                uri: 'https://itunes.apple.com/us/app/scybot-coin-counter/id445453916?mt=8&uo=4',
                categories: [
                    'Utilities',
                    'Finance'
                ],
                price: 'Free',
                extID: 445453916,
                images: [
                    {
                        uri: 'http://a3.mzstatic.com/us/r30/Purple/v4/f4/37/6d/f4376deb-012f-27fe-5865-d3e4b1c58a0e/screen320x480.jpeg',
                        type: 'screenshot',
                        device: 'phone'
                    },
                    {
                        uri: 'http://a3.mzstatic.com/us/r30/Purple/v4/ed/f5/f5/edf5f5c5-9885-9e3f-87e2-872ae89ec81c/screen480x480.jpeg',
                        type: 'screenshot',
                        device: 'tablet'
                    },
                    {
                        uri: 'http://is2.mzstatic.com/image/thumb/Purple/v4/ff/3d/0f/ff3d0ffb-3d7e-7a5d-a93e-37e9d9def605/source/512x512bb.jpg',
                        type: 'thumbnail'
                    }
                ]
            };
            targeting = {
                gender: TARGETING.GENDER.MALE,
                age: TARGETING.AGE.THIRTEEN_PLUS
            };

            result = campaignFromData({ productData, targeting });
        });

        it('should return a campaign object', function() {
            expect(result).toEqual({
                application: 'showcase',
                cards: [],
                name: productData.name,
                status: 'draft',
                product: productData,
                targeting: {
                    demographics: {
                        age: [targeting.age],
                        gender: [targeting.gender]
                    },
                    appStoreCategory: productData.categories
                }
            });
        });

        describe('if there is no targeting', function() {
            beforeEach(function() {
                targeting.age = TARGETING.AGE.ALL;
                targeting.gender = TARGETING.GENDER.ALL;

                result = campaignFromData({ productData, targeting });
            });

            it('should make the targeting array empty', function() {
                expect(result).toEqual(jasmine.objectContaining({
                    targeting: {
                        demographics: {
                            age: [],
                            gender: []
                        },
                        appStoreCategory: productData.categories
                    }
                }));
            });
        });

        describe('if a partial campaign is passed', function() {
            let campaign;

            beforeEach(function() {
                campaign = {
                    advertiserId: `a-${createUuid()}`
                };

                productData = {
                    name: 'New Name',
                    description: 'New Description'
                };
                targeting = {
                    gender: TARGETING.GENDER.FEMALE
                };

                result = campaignFromData({ productData, targeting }, campaign);
            });

            it('should use defaults to create a full campaign', function() {
                expect(result).toEqual({
                    advertiserId: campaign.advertiserId,
                    application: 'showcase',
                    cards: [],
                    name: productData.name,
                    status: 'draft',
                    product: productData,
                    targeting: {
                        demographics: {
                            gender: [TARGETING.GENDER.FEMALE],
                            age: []
                        },
                        appStoreCategory: []
                    }
                });
            });
        });

        describe('if a campaign is passed', function() {
            let campaign;

            beforeEach(function() {
                campaign = {
                    id: `cam-${createUuid()}`,
                    application: 'showcase',
                    cards: [{}, {}],
                    name: productData.name,
                    status: 'active',
                    product: clone(productData),
                    created: new Date().toISOString(),
                    lastUpdated: new Date().toISOString(),
                    targeting: {
                        demographics: {
                            gender: [targeting.gender],
                            age: [targeting.age]
                        },
                        appStoreCategory: clone(productData.categories)
                    }
                };

                productData = {
                    name: 'New Name',
                    description: 'New Description'
                };
                targeting = {
                    gender: TARGETING.GENDER.FEMALE
                };

                result = campaignFromData({ productData, targeting }, campaign);
            });

            it('should deeply extend the old campaign with the udpated data', function() {
                expect(result).toEqual({
                    id: campaign.id,
                    application: 'showcase',
                    cards: [{}, {}],
                    name: productData.name,
                    status: 'active',
                    product: assign({}, campaign.product, productData),
                    created: campaign.created,
                    lastUpdated: campaign.lastUpdated,
                    targeting: {
                        demographics: {
                            gender: [targeting.gender],
                            age: campaign.targeting.demographics.age
                        },
                        appStoreCategory: campaign.targeting.appStoreCategory
                    }
                });
            });

            describe('if the targeting is removed', function() {
                beforeEach(function() {
                    targeting.gender = TARGETING.GENDER.ALL;
                    targeting.age = TARGETING.AGE.ALL;

                    result = campaignFromData({ productData, targeting }, campaign);
                });

                it('should remove targeting for the campaign', function() {
                    expect(result).toEqual(jasmine.objectContaining({
                        targeting: jasmine.objectContaining({
                            demographics: jasmine.objectContaining({
                                gender: [],
                                age: []
                            })
                        })
                    }));
                });
            });
        });
    });

    describe('productDataFromCampaign(campaign)', function() {
        let productData, targeting;
        let campaign;
        let result;

        beforeEach(function() {
            productData = {
                type: 'app',
                platform: 'iOS',
                name: 'Scybot Coin Counter',
                description: 'This is a great app!',
                uri: 'https://itunes.apple.com/us/app/scybot-coin-counter/id445453916?mt=8&uo=4',
                categories: [
                    'Utilities',
                    'Finance'
                ],
                price: 'Free',
                extID: 445453916,
                images: [
                    {
                        uri: 'http://a3.mzstatic.com/us/r30/Purple/v4/f4/37/6d/f4376deb-012f-27fe-5865-d3e4b1c58a0e/screen320x480.jpeg',
                        type: 'screenshot',
                        device: 'phone'
                    },
                    {
                        uri: 'http://a3.mzstatic.com/us/r30/Purple/v4/ed/f5/f5/edf5f5c5-9885-9e3f-87e2-872ae89ec81c/screen480x480.jpeg',
                        type: 'screenshot',
                        device: 'tablet'
                    },
                    {
                        uri: 'http://is2.mzstatic.com/image/thumb/Purple/v4/ff/3d/0f/ff3d0ffb-3d7e-7a5d-a93e-37e9d9def605/source/512x512bb.jpg',
                        type: 'thumbnail'
                    }
                ]
            };
            targeting = {};

            campaign = campaignFromData({ productData, targeting });

            result = productDataFromCampaign(campaign);
        });

        it('should return the campaign\'s product', function() {
            expect(result).toEqual(campaign.product);
            expect(result).not.toBe(campaign.product);
        });

        describe('if the campaign is undefined', function() {
            beforeEach(function() {
                campaign = undefined;
                result = productDataFromCampaign(campaign);
            });

            it('should return null', function() {
                expect(result).toBeNull();
            });
        });
    });

    describe('targetingFromCampaign(campaign)', function() {
        let productData, targeting;
        let campaign;
        let result;

        beforeEach(function() {
            productData = {
                name: 'Scybot Coin Counter',
                description: 'This is a great app!'
            };
            targeting = {
                age: TARGETING.AGE.THIRTEEN_PLUS,
                gender: TARGETING.GENDER.FEMALE
            };

            campaign = campaignFromData({ productData, targeting });

            result = targetingFromCampaign(campaign);
        });

        it('should return the targeting', function() {
            expect(result).toEqual(targeting);
        });

        describe('if there is no targeting', function() {
            beforeEach(function() {
                targeting.age = TARGETING.AGE.ALL;
                targeting.gender = TARGETING.GENDER.ALL;

                campaign = campaignFromData({ productData, targeting });

                result = targetingFromCampaign(campaign);
            });

            it('should return the targeting', function() {
                expect(result).toEqual(targeting);
            });
        });

        describe('if the campaign is undefined', function() {
            beforeEach(function() {
                campaign = undefined;
                result = targetingFromCampaign(campaign);
            });

            it('should return null', function() {
                expect(result).toBeNull();
            });
        });
    });
});
