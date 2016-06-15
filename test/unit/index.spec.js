'use strict';

const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;

const preprocessor = require('../../lib');

describe('Preprocessor index', () => {

    describe('Interface', () => {
        it('should have defined interface', () => {
            expect(preprocessor.use).to.be.a('function', 'no `use` method');
            expect(preprocessor.register).to.be.a('function', 'no `register` method');
            expect(preprocessor.onMessage).to.be.a('function', 'no `onMessage` method');
        });

        it('should have Processor class', () => {
            expect(preprocessor.Processor).to.be.a('function', 'no `Processor` property');
        });
    });

    describe('Use', () => {

        it('should accept adding processor by name if registered', () => {
            delete preprocessor._inUse.mentions;

            preprocessor.use('mentions');
            expect(preprocessor._inUse.mentions).to.exist;
        });

        it('should accept adding processor by convention', () => {
            delete preprocessor._inUse.tags;

            preprocessor.use({
                name: 'tags',
                matcher() {
                    // empty matcher
                }
            });

            expect(preprocessor._inUse.tags).to.exist;
        });

        it('should throw an error if processor is not registered', () => {

            assert.throws(testFunction, 'Not a processor type');

            function testFunction() {
                preprocessor.use('someabstractprocessor');
            }
        });
    });

    describe('Register', () => {
        it('should register new processor', () => {
            delete preprocessor._registered.tags;

            preprocessor.register('tags', () => {
                // no handler
            });

            expect(preprocessor._registered.tags).to.exist;
        });

        it('should throw an error if already registered', () => {
            preprocessor._registered.tags = {}

            assert.throws(testFunction, 'is already registered');

            function testFunction() {
                preprocessor.register('tags', () => {
                    // no hanlder
                });
            }
        });
    });

    describe('OnMessage', () => {
        beforeEach(() => {
            delete preprocessor._inUse.words;

            // simple text processor that splits words and counts them
            preprocessor.use({
                name: 'words',
                matcher(message) {
                    if (!message || !message.trim()) {
                        return;
                    }

                    const words = message.split(/\s/);

                    return {
                        list: words,
                        count: words.length
                    }
                }
            });
        });

        it('should run words preprocessor', (done) => {
            preprocessor.onMessage('hello word')
                .then((result) => {
                    expect(result.words).to.exist;
                    expect(result.words.list).to.be.an('array');
                    expect(result.words.count).to.equal(2);
                })
                .finally(done);
        });

        it('should run words preprocessor and return no results for empty message', (done) => {
            preprocessor.onMessage('')
                .then((result) => {
                    expect(result.words).not.to.exist;
                })
                .finally(done);
        });

        it('should not run words preprocessor', (done) => {
            delete preprocessor._inUse.words;

            preprocessor.onMessage('hello word')
                .then((result) => {
                    expect(result.words).not.to.exist;
                })
                .finally(done);
        });

        it('should run several preprocessors', (done) => {
            preprocessor.use('mentions', 'emotions');
            preprocessor.onMessage('hello @world, how about some (coffee)?')
                .then((result) => {
                    expect(result.mentions).to.exist;
                    expect(result.emotions).to.exist;
                    expect(result.words).to.exist;
                })
                .finally(done);
        });
    });
});
