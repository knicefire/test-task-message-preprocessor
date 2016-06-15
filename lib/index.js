'use strict';

const assert = require('assert');

const REGISTERED = {
    mentions: require('./processors/mentions'),
    emotions: require('./processors/emotions'),
    links   : require('./processors/links')
}

const IN_USE = {};
const Promise = require('bluebird');

class Processor {
    constructor(proto) {
        if (proto instanceof this.constructor) {
            return proto;
        }

        assert(this.isProcessor(proto), 'Not a processor type');

        Object.assign(this, proto);
    }

    /**
     * Interface match verification
     * @param {any}
     * @return {Boolean} true if interface is similart to a text processor
     */
    isProcessor(proc) {
        return proc && typeof proc === 'object'
            && proc.matcher && typeof proc.matcher === 'function'
            && proc.name && typeof proc.name === 'string';
    }
}


module.exports = {
    Processor,

    _inUse: IN_USE,
    _registered: REGISTERED,

    /**
     * Adds new text processor to the processors chain
     * @param {Object|String|Arguments} - ProcessorName or instance
     */
    use() {
        const args = Array.prototype.slice.call(arguments);

        args.forEach((processor) => {
            processor = typeof processor === 'string'
            ? REGISTERED[processor]
            : processor;

            processor = new Processor(processor);
            IN_USE[processor.name] = processor;
        });
    },

    /**
     * Adds new text processor to the register
     * @param {String} - name of a processor
     * @param {Function} - matcher - a parsing function
     * @param {Boolean} - use - use after register
     */
    register(name, matcher, use) {
        assert(REGISTERED[name] === undefined, `'${name}' processor is already registered`);

        REGISTERED[name] = new Processor({ name, matcher });

        if (use) {
            this.use(name);
        }
    },

    /**
     * Processes given message asynchrounously
     * @param {String} message
     * @returns {Promise} resulted in object of found context
     */
    onMessage(message) {
        assert(typeof message === 'string', 'message is not a string');

        const processors = Object.keys(IN_USE).reduce((result, proc) => {
            result.push(IN_USE[proc]);

            return result;
        }, []);

        return Promise.reduce(processors, (result, proc) => {
            return Promise.resolve(proc.matcher(message))
                .then((context) => {
                    // simplified validation on emtpy object
                    const isNonEmpty = context && Boolean(context.length || Object.keys(context).length);

                    // apply only non-empty results
                    if (isNonEmpty) {

                        result[proc.name] = context;
                    }

                    return result;
                });
        }, {});
    }
}
