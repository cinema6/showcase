import StarRating from '../../src/components/StarRating';
import { mount } from 'enzyme';
import React from 'react';
import numeral from 'numeral';

describe('StarRating', function() {
    beforeEach(function() {
        this.props = {
            rating: 3
        };

        this.component = mount(
            <StarRating {...this.props} />
        );
    });

    it('should exist', function() {
        expect(this.component.length).toBe(1, 'StarRating not rendered.');
    });

    it('should render 5 stars items', function() {
        expect(this.component.find('li').length).toBe(5, '5 Stars not rendered.');
    });

    it('should not render the number of ratings', function() {
        expect(this.component.find('p').length).toBe(0, '<p> is rendered');
    });

    describe('if a ratingCount is specified', function() {
        beforeEach(function() {
            this.component.setProps({ ratingCount: 12345678 });
        });

        it('should render the ratingCount', function() {
            expect(this.component.find('p').text()).toBe(`${numeral(this.component.prop('ratingCount')).format('0,0')} Ratings`);
        });
    });

    it('should render 0 stars', function() {
        this.component.setProps({ rating: 0 });

        expect(this.component.find('li i').at(0).hasClass('fa-star-o')).toBe(true, 'First star does not have "fa-star-o" class');
        expect(this.component.find('li i').at(0).hasClass('fa-star')).toBe(false, 'First star does have "fa-star" class');
        expect(this.component.find('li i').at(0).hasClass('fa-star-half-o')).toBe(false, 'First star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(1).hasClass('fa-star-o')).toBe(true, 'Second star does not have "fa-star-o" class');
        expect(this.component.find('li i').at(1).hasClass('fa-star')).toBe(false, 'Second star does have "fa-star" class');
        expect(this.component.find('li i').at(1).hasClass('fa-star-half-o')).toBe(false, 'Second star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(2).hasClass('fa-star-o')).toBe(true, 'Third star does not have "fa-star-o" class');
        expect(this.component.find('li i').at(2).hasClass('fa-star')).toBe(false, 'Third star does have "fa-star" class');
        expect(this.component.find('li i').at(2).hasClass('fa-star-half-o')).toBe(false, 'Third star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(3).hasClass('fa-star-o')).toBe(true, 'Fourth star does not have "fa-star-o" class');
        expect(this.component.find('li i').at(3).hasClass('fa-star')).toBe(false, 'Fourth star does have "fa-star" class');
        expect(this.component.find('li i').at(3).hasClass('fa-star-half-o')).toBe(false, 'Fourth star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(4).hasClass('fa-star-o')).toBe(true, 'Fifth star does not have "fa-star-o" class');
        expect(this.component.find('li i').at(4).hasClass('fa-star')).toBe(false, 'Fifth star does have "fa-star" class');
        expect(this.component.find('li i').at(4).hasClass('fa-star-half-o')).toBe(false, 'Fifth star does have "fa-star-half-o" class');
    });

    it('should render 0.5 stars', function() {
        this.component.setProps({ rating: 0.5 });

        expect(this.component.find('li i').at(0).hasClass('fa-star-o')).toBe(false, 'First star does have "fa-star-o" class');
        expect(this.component.find('li i').at(0).hasClass('fa-star')).toBe(false, 'First star does have "fa-star" class');
        expect(this.component.find('li i').at(0).hasClass('fa-star-half-o')).toBe(true, 'First star does not have "fa-star-half-o" class');

        expect(this.component.find('li i').at(1).hasClass('fa-star-o')).toBe(true, 'Second star does not have "fa-star-o" class');
        expect(this.component.find('li i').at(1).hasClass('fa-star')).toBe(false, 'Second star does have "fa-star" class');
        expect(this.component.find('li i').at(1).hasClass('fa-star-half-o')).toBe(false, 'Second star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(2).hasClass('fa-star-o')).toBe(true, 'Third star does not have "fa-star-o" class');
        expect(this.component.find('li i').at(2).hasClass('fa-star')).toBe(false, 'Third star does have "fa-star" class');
        expect(this.component.find('li i').at(2).hasClass('fa-star-half-o')).toBe(false, 'Third star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(3).hasClass('fa-star-o')).toBe(true, 'Fourth star does not have "fa-star-o" class');
        expect(this.component.find('li i').at(3).hasClass('fa-star')).toBe(false, 'Fourth star does have "fa-star" class');
        expect(this.component.find('li i').at(3).hasClass('fa-star-half-o')).toBe(false, 'Fourth star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(4).hasClass('fa-star-o')).toBe(true, 'Fifth star does not have "fa-star-o" class');
        expect(this.component.find('li i').at(4).hasClass('fa-star')).toBe(false, 'Fifth star does have "fa-star" class');
        expect(this.component.find('li i').at(4).hasClass('fa-star-half-o')).toBe(false, 'Fifth star does have "fa-star-half-o" class');
    });

    it('should render 1 stars', function() {
        this.component.setProps({ rating: 1 });

        expect(this.component.find('li i').at(0).hasClass('fa-star-o')).toBe(false, 'First star does have "fa-star-o" class');
        expect(this.component.find('li i').at(0).hasClass('fa-star')).toBe(true, 'First star does not have "fa-star" class');
        expect(this.component.find('li i').at(0).hasClass('fa-star-half-o')).toBe(false, 'First star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(1).hasClass('fa-star-o')).toBe(true, 'Second star does not have "fa-star-o" class');
        expect(this.component.find('li i').at(1).hasClass('fa-star')).toBe(false, 'Second star does have "fa-star" class');
        expect(this.component.find('li i').at(1).hasClass('fa-star-half-o')).toBe(false, 'Second star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(2).hasClass('fa-star-o')).toBe(true, 'Third star does not have "fa-star-o" class');
        expect(this.component.find('li i').at(2).hasClass('fa-star')).toBe(false, 'Third star does have "fa-star" class');
        expect(this.component.find('li i').at(2).hasClass('fa-star-half-o')).toBe(false, 'Third star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(3).hasClass('fa-star-o')).toBe(true, 'Fourth star does not have "fa-star-o" class');
        expect(this.component.find('li i').at(3).hasClass('fa-star')).toBe(false, 'Fourth star does have "fa-star" class');
        expect(this.component.find('li i').at(3).hasClass('fa-star-half-o')).toBe(false, 'Fourth star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(4).hasClass('fa-star-o')).toBe(true, 'Fifth star does not have "fa-star-o" class');
        expect(this.component.find('li i').at(4).hasClass('fa-star')).toBe(false, 'Fifth star does have "fa-star" class');
        expect(this.component.find('li i').at(4).hasClass('fa-star-half-o')).toBe(false, 'Fifth star does have "fa-star-half-o" class');
    });

    it('should render 1.5 stars', function() {
        this.component.setProps({ rating: 1.5 });

        expect(this.component.find('li i').at(0).hasClass('fa-star-o')).toBe(false, 'First star does have "fa-star-o" class');
        expect(this.component.find('li i').at(0).hasClass('fa-star')).toBe(true, 'First star does not have "fa-star" class');
        expect(this.component.find('li i').at(0).hasClass('fa-star-half-o')).toBe(false, 'First star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(1).hasClass('fa-star-o')).toBe(false, 'Second star does have "fa-star-o" class');
        expect(this.component.find('li i').at(1).hasClass('fa-star')).toBe(false, 'Second star does have "fa-star" class');
        expect(this.component.find('li i').at(1).hasClass('fa-star-half-o')).toBe(true, 'Second star does not have "fa-star-half-o" class');

        expect(this.component.find('li i').at(2).hasClass('fa-star-o')).toBe(true, 'Third star does not have "fa-star-o" class');
        expect(this.component.find('li i').at(2).hasClass('fa-star')).toBe(false, 'Third star does have "fa-star" class');
        expect(this.component.find('li i').at(2).hasClass('fa-star-half-o')).toBe(false, 'Third star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(3).hasClass('fa-star-o')).toBe(true, 'Fourth star does not have "fa-star-o" class');
        expect(this.component.find('li i').at(3).hasClass('fa-star')).toBe(false, 'Fourth star does have "fa-star" class');
        expect(this.component.find('li i').at(3).hasClass('fa-star-half-o')).toBe(false, 'Fourth star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(4).hasClass('fa-star-o')).toBe(true, 'Fifth star does not have "fa-star-o" class');
        expect(this.component.find('li i').at(4).hasClass('fa-star')).toBe(false, 'Fifth star does have "fa-star" class');
        expect(this.component.find('li i').at(4).hasClass('fa-star-half-o')).toBe(false, 'Fifth star does have "fa-star-half-o" class');
    });

    it('should render 2 stars', function() {
        this.component.setProps({ rating: 2 });

        expect(this.component.find('li i').at(0).hasClass('fa-star-o')).toBe(false, 'First star does have "fa-star-o" class');
        expect(this.component.find('li i').at(0).hasClass('fa-star')).toBe(true, 'First star does not have "fa-star" class');
        expect(this.component.find('li i').at(0).hasClass('fa-star-half-o')).toBe(false, 'First star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(1).hasClass('fa-star-o')).toBe(false, 'Second star does have "fa-star-o" class');
        expect(this.component.find('li i').at(1).hasClass('fa-star')).toBe(true, 'Second star does not have "fa-star" class');
        expect(this.component.find('li i').at(1).hasClass('fa-star-half-o')).toBe(false, 'Second star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(2).hasClass('fa-star-o')).toBe(true, 'Third star does not have "fa-star-o" class');
        expect(this.component.find('li i').at(2).hasClass('fa-star')).toBe(false, 'Third star does have "fa-star" class');
        expect(this.component.find('li i').at(2).hasClass('fa-star-half-o')).toBe(false, 'Third star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(3).hasClass('fa-star-o')).toBe(true, 'Fourth star does not have "fa-star-o" class');
        expect(this.component.find('li i').at(3).hasClass('fa-star')).toBe(false, 'Fourth star does have "fa-star" class');
        expect(this.component.find('li i').at(3).hasClass('fa-star-half-o')).toBe(false, 'Fourth star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(4).hasClass('fa-star-o')).toBe(true, 'Fifth star does not have "fa-star-o" class');
        expect(this.component.find('li i').at(4).hasClass('fa-star')).toBe(false, 'Fifth star does have "fa-star" class');
        expect(this.component.find('li i').at(4).hasClass('fa-star-half-o')).toBe(false, 'Fifth star does have "fa-star-half-o" class');
    });

    it('should render 2.5 stars', function() {
        this.component.setProps({ rating: 2.5 });

        expect(this.component.find('li i').at(0).hasClass('fa-star-o')).toBe(false, 'First star does have "fa-star-o" class');
        expect(this.component.find('li i').at(0).hasClass('fa-star')).toBe(true, 'First star does not have "fa-star" class');
        expect(this.component.find('li i').at(0).hasClass('fa-star-half-o')).toBe(false, 'First star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(1).hasClass('fa-star-o')).toBe(false, 'Second star does have "fa-star-o" class');
        expect(this.component.find('li i').at(1).hasClass('fa-star')).toBe(true, 'Second star does not have "fa-star" class');
        expect(this.component.find('li i').at(1).hasClass('fa-star-half-o')).toBe(false, 'Second star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(2).hasClass('fa-star-o')).toBe(false, 'Third star does have "fa-star-o" class');
        expect(this.component.find('li i').at(2).hasClass('fa-star')).toBe(false, 'Third star does have "fa-star" class');
        expect(this.component.find('li i').at(2).hasClass('fa-star-half-o')).toBe(true, 'Third star does not have "fa-star-half-o" class');

        expect(this.component.find('li i').at(3).hasClass('fa-star-o')).toBe(true, 'Fourth star does not have "fa-star-o" class');
        expect(this.component.find('li i').at(3).hasClass('fa-star')).toBe(false, 'Fourth star does have "fa-star" class');
        expect(this.component.find('li i').at(3).hasClass('fa-star-half-o')).toBe(false, 'Fourth star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(4).hasClass('fa-star-o')).toBe(true, 'Fifth star does not have "fa-star-o" class');
        expect(this.component.find('li i').at(4).hasClass('fa-star')).toBe(false, 'Fifth star does have "fa-star" class');
        expect(this.component.find('li i').at(4).hasClass('fa-star-half-o')).toBe(false, 'Fifth star does have "fa-star-half-o" class');
    });

    it('should render 3 stars', function() {
        this.component.setProps({ rating: 3 });

        expect(this.component.find('li i').at(0).hasClass('fa-star-o')).toBe(false, 'First star does have "fa-star-o" class');
        expect(this.component.find('li i').at(0).hasClass('fa-star')).toBe(true, 'First star does not have "fa-star" class');
        expect(this.component.find('li i').at(0).hasClass('fa-star-half-o')).toBe(false, 'First star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(1).hasClass('fa-star-o')).toBe(false, 'Second star does not have "fa-star-o" class');
        expect(this.component.find('li i').at(1).hasClass('fa-star')).toBe(true, 'Second star does not have "fa-star" class');
        expect(this.component.find('li i').at(1).hasClass('fa-star-half-o')).toBe(false, 'Second star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(2).hasClass('fa-star-o')).toBe(false, 'Third star does have "fa-star-o" class');
        expect(this.component.find('li i').at(2).hasClass('fa-star')).toBe(true, 'Third star does not have "fa-star" class');
        expect(this.component.find('li i').at(2).hasClass('fa-star-half-o')).toBe(false, 'Third star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(3).hasClass('fa-star-o')).toBe(true, 'Fourth star does not have "fa-star-o" class');
        expect(this.component.find('li i').at(3).hasClass('fa-star')).toBe(false, 'Fourth star does have "fa-star" class');
        expect(this.component.find('li i').at(3).hasClass('fa-star-half-o')).toBe(false, 'Fourth star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(4).hasClass('fa-star-o')).toBe(true, 'Fifth star does not have "fa-star-o" class');
        expect(this.component.find('li i').at(4).hasClass('fa-star')).toBe(false, 'Fifth star does have "fa-star" class');
        expect(this.component.find('li i').at(4).hasClass('fa-star-half-o')).toBe(false, 'Fifth star does have "fa-star-half-o" class');
    });

    it('should render 3.5 stars', function() {
        this.component.setProps({ rating: 3.5 });

        expect(this.component.find('li i').at(0).hasClass('fa-star-o')).toBe(false, 'First star does have "fa-star-o" class');
        expect(this.component.find('li i').at(0).hasClass('fa-star')).toBe(true, 'First star does not have "fa-star" class');
        expect(this.component.find('li i').at(0).hasClass('fa-star-half-o')).toBe(false, 'First star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(1).hasClass('fa-star-o')).toBe(false, 'Second star does not have "fa-star-o" class');
        expect(this.component.find('li i').at(1).hasClass('fa-star')).toBe(true, 'Second star does not have "fa-star" class');
        expect(this.component.find('li i').at(1).hasClass('fa-star-half-o')).toBe(false, 'Second star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(2).hasClass('fa-star-o')).toBe(false, 'Third star does have "fa-star-o" class');
        expect(this.component.find('li i').at(2).hasClass('fa-star')).toBe(true, 'Third star does not have "fa-star" class');
        expect(this.component.find('li i').at(2).hasClass('fa-star-half-o')).toBe(false, 'Third star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(3).hasClass('fa-star-o')).toBe(false, 'Fourth star does have "fa-star-o" class');
        expect(this.component.find('li i').at(3).hasClass('fa-star')).toBe(false, 'Fourth star does have "fa-star" class');
        expect(this.component.find('li i').at(3).hasClass('fa-star-half-o')).toBe(true, 'Fourth star does not have "fa-star-half-o" class');

        expect(this.component.find('li i').at(4).hasClass('fa-star-o')).toBe(true, 'Fifth star does not have "fa-star-o" class');
        expect(this.component.find('li i').at(4).hasClass('fa-star')).toBe(false, 'Fifth star does have "fa-star" class');
        expect(this.component.find('li i').at(4).hasClass('fa-star-half-o')).toBe(false, 'Fifth star does have "fa-star-half-o" class');
    });

    it('should render 4 stars', function() {
        this.component.setProps({ rating: 4 });

        expect(this.component.find('li i').at(0).hasClass('fa-star-o')).toBe(false, 'First star does have "fa-star-o" class');
        expect(this.component.find('li i').at(0).hasClass('fa-star')).toBe(true, 'First star does not have "fa-star" class');
        expect(this.component.find('li i').at(0).hasClass('fa-star-half-o')).toBe(false, 'First star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(1).hasClass('fa-star-o')).toBe(false, 'Second star does not have "fa-star-o" class');
        expect(this.component.find('li i').at(1).hasClass('fa-star')).toBe(true, 'Second star does not have "fa-star" class');
        expect(this.component.find('li i').at(1).hasClass('fa-star-half-o')).toBe(false, 'Second star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(2).hasClass('fa-star-o')).toBe(false, 'Third star does have "fa-star-o" class');
        expect(this.component.find('li i').at(2).hasClass('fa-star')).toBe(true, 'Third star does not have "fa-star" class');
        expect(this.component.find('li i').at(2).hasClass('fa-star-half-o')).toBe(false, 'Third star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(3).hasClass('fa-star-o')).toBe(false, 'Fourth star does have "fa-star-o" class');
        expect(this.component.find('li i').at(3).hasClass('fa-star')).toBe(true, 'Fourth star does not have "fa-star" class');
        expect(this.component.find('li i').at(3).hasClass('fa-star-half-o')).toBe(false, 'Fourth star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(4).hasClass('fa-star-o')).toBe(true, 'Fifth star does not have "fa-star-o" class');
        expect(this.component.find('li i').at(4).hasClass('fa-star')).toBe(false, 'Fifth star does have "fa-star" class');
        expect(this.component.find('li i').at(4).hasClass('fa-star-half-o')).toBe(false, 'Fifth star does have "fa-star-half-o" class');
    });

    it('should render 4.5 stars', function() {
        this.component.setProps({ rating: 4.5 });

        expect(this.component.find('li i').at(0).hasClass('fa-star-o')).toBe(false, 'First star does have "fa-star-o" class');
        expect(this.component.find('li i').at(0).hasClass('fa-star')).toBe(true, 'First star does not have "fa-star" class');
        expect(this.component.find('li i').at(0).hasClass('fa-star-half-o')).toBe(false, 'First star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(1).hasClass('fa-star-o')).toBe(false, 'Second star does not have "fa-star-o" class');
        expect(this.component.find('li i').at(1).hasClass('fa-star')).toBe(true, 'Second star does not have "fa-star" class');
        expect(this.component.find('li i').at(1).hasClass('fa-star-half-o')).toBe(false, 'Second star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(2).hasClass('fa-star-o')).toBe(false, 'Third star does have "fa-star-o" class');
        expect(this.component.find('li i').at(2).hasClass('fa-star')).toBe(true, 'Third star does not have "fa-star" class');
        expect(this.component.find('li i').at(2).hasClass('fa-star-half-o')).toBe(false, 'Third star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(3).hasClass('fa-star-o')).toBe(false, 'Fourth star does have "fa-star-o" class');
        expect(this.component.find('li i').at(3).hasClass('fa-star')).toBe(true, 'Fourth star does not have "fa-star" class');
        expect(this.component.find('li i').at(3).hasClass('fa-star-half-o')).toBe(false, 'Fourth star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(4).hasClass('fa-star-o')).toBe(false, 'Fifth star does have "fa-star-o" class');
        expect(this.component.find('li i').at(4).hasClass('fa-star')).toBe(false, 'Fifth star does have "fa-star" class');
        expect(this.component.find('li i').at(4).hasClass('fa-star-half-o')).toBe(true, 'Fifth star does not have "fa-star-half-o" class');
    });

    it('should render 5 stars', function() {
        this.component.setProps({ rating: 5 });

        expect(this.component.find('li i').at(0).hasClass('fa-star-o')).toBe(false, 'First star does have "fa-star-o" class');
        expect(this.component.find('li i').at(0).hasClass('fa-star')).toBe(true, 'First star does not have "fa-star" class');
        expect(this.component.find('li i').at(0).hasClass('fa-star-half-o')).toBe(false, 'First star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(1).hasClass('fa-star-o')).toBe(false, 'Second star does not have "fa-star-o" class');
        expect(this.component.find('li i').at(1).hasClass('fa-star')).toBe(true, 'Second star does not have "fa-star" class');
        expect(this.component.find('li i').at(1).hasClass('fa-star-half-o')).toBe(false, 'Second star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(2).hasClass('fa-star-o')).toBe(false, 'Third star does have "fa-star-o" class');
        expect(this.component.find('li i').at(2).hasClass('fa-star')).toBe(true, 'Third star does not have "fa-star" class');
        expect(this.component.find('li i').at(2).hasClass('fa-star-half-o')).toBe(false, 'Third star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(3).hasClass('fa-star-o')).toBe(false, 'Fourth star does have "fa-star-o" class');
        expect(this.component.find('li i').at(3).hasClass('fa-star')).toBe(true, 'Fourth star does not have "fa-star" class');
        expect(this.component.find('li i').at(3).hasClass('fa-star-half-o')).toBe(false, 'Fourth star does have "fa-star-half-o" class');

        expect(this.component.find('li i').at(4).hasClass('fa-star-o')).toBe(false, 'Fifth star does have "fa-star-o" class');
        expect(this.component.find('li i').at(4).hasClass('fa-star')).toBe(true, 'Fifth star does not have "fa-star" class');
        expect(this.component.find('li i').at(4).hasClass('fa-star-half-o')).toBe(false, 'Fifth star does have "fa-star-half-o" class');
    });
});
