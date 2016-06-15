'use strict';

const chai = require('chai');
const expect = chai.expect;

const mentions = require('../../../lib/processors/mentions');

describe('Mentions preprocessor', () => {

    describe('Interface', () => {
        it('should have defined interface', () => {
            expect(mentions.name).to.be.a('string', 'no `use` method');
            expect(mentions.name).to.be.equal('mentions');
            expect(mentions.matcher).to.be.a('function', 'no `matcher` method');
        });
    });

    describe('Parsing', () => {
        it('should return no results if noone is mentioned', () => {
            expect(mentions.matcher('hello someone')).to.deep.equal([]);
            expect(mentions.matcher('hello som@eone')).to.deep.equal([]);
            expect(mentions.matcher('hell@ some@ne')).to.deep.equal([]);
        });

        it('should return a list of users whom been mentioned', () => {
            expect(mentions.matcher('@hello someone')).to.deep.equal(['hello']);
            expect(mentions.matcher('hello @someone')).to.deep.equal(['someone']);
            expect(mentions.matcher('@hello @somene')).to.deep.equal(['hello', 'somene']);
        });

        it('should return a list of unique users whom been mentioned', () => {
            expect(mentions.matcher('hello @user, how are you @user?')).to.deep.equal(['user']);
        });

        it('should accept dot and hyphen in names', () => {
            expect(mentions.matcher('hello @john.doe, how are you?')).to.deep.equal(['john.doe']);
            expect(mentions.matcher('hello @john-doe, how are you?')).to.deep.equal(['john-doe']);
        });

        it('should propery hanlde @ symbol in the middle of the name', () => {
            expect(mentions.matcher('hello @john.doe@example.com, how are you?')).to.deep.equal(['john.doe@example.com']);
        });
    });
});
