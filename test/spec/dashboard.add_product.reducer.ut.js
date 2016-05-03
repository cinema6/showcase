import dashboardAddProductReducer from '../../src/reducers/page/dashboard/add_product';

describe('dashboardAddProductReducer()', function() {
    it('should return some initial state for the page', function() {
        expect(dashboardAddProductReducer(undefined, 'INIT')).toEqual({
        });
    });
});
