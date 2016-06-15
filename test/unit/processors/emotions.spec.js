'use strict';

const chai = require('chai');
const expect = chai.expect;

const emotions = require('../../../lib/processors/emotions');

describe('Emotions preprocessor', () => {

    describe('Interface', () => {
        it('should have defined interface', () => {
            expect(emotions.name).to.be.a('string', 'no `use` method');
            expect(emotions.name).to.be.equal('emotions');
            expect(emotions.matcher).to.be.a('function', 'no `matcher` method');
        });
    });

    describe('Parsing', () => {
        it('should return no results if no emotions been places', () => {
            expect(emotions.matcher('how about some tea or coffee?')).to.deep.equal([]);
        });

        it('should return a valid list of unique emotions', () => {
            expect(emotions.matcher('how about some (tea) or (coffee)? (tea) is better')).to.deep.equal(['tea', 'coffee']);
        });

        it('should not treat as emotions prases with more than one word', () => {
            expect(emotions.matcher('how about some (tea coffee) or (coffee)?')).to.deep.equal(['coffee']);
        });

        it('should not treat as emotions prases with words for more than 15 symbols', () => {
            expect(emotions.matcher('how about some (teacoffeeeeeeeee) or (coffee)?')).to.deep.equal(['coffee']);
        });

        it('should not treat as emotions prases with empty parenthesis', () => {
            expect(emotions.matcher('how about some () or (coffee)?')).to.deep.equal(['coffee']);
        });
    });
});
