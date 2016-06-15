'use strict';

const chai = require('chai');
const expect = chai.expect;

const links = require('../../../lib/processors/links');

const LINKS = {
    emotions: {
        url: 'https://www.hipchat.com/emoticons',
        title: 'HipChat - Emoticons'
    },
    tweet: {
        url: 'https://twitter.com/jdorfman/status/430511497475670016',
        title: 'Justin Dorfman on Twitter: &quot;nice @littlebigdetail from @HipChat (shows hex colors when pasted in chat). http://t.co/7cI6Gjy5pq&quot;'
    },
    profile: {
        url: 'https://twitter.com/jdorfman',
        title: 'Justin Dorfman (@jdorfman) | Twitter'
    }
}


describe('Links preprocessor', () => {

    describe('Interface', () => {
        it('should have defined interface', () => {
            expect(links.name).to.be.a('string', 'no `use` method');
            expect(links.name).to.be.equal('links');
            expect(links.matcher).to.be.a('function', 'no `matcher` method');
        });
    });

    describe('Parsing', () => {
        it('should return no results if no links specified', (done) => {
            links.matcher('have you googled this?')
                .then((result) => {
                    expect(result).to.deep.equal([]);
                })
                .finally(done);
        });

        it('should return a list of links with titles', (done) => {
            links.matcher(`they, take a look at the emotions list here ${LINKS.emotions.url}`)
                .then((result) => {
                    expect(result).to.deep.equal([
                        LINKS.emotions
                    ]);
                })
                .finally(done)
        });

        it('should return a valid list of unique links with titles', (done) => {
            links.matcher(`
                they, take a look at the tweet ${LINKS.tweet.url},
                by url: ${LINKS.tweet.url},
                from this dude: ${LINKS.profile.url}`)
                .then((result) => {
                    expect(result).to.deep.equal([
                        LINKS.tweet,
                        LINKS.profile
                    ]);
                })
                .finally(done)
        });
    });
});
