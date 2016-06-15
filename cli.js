'use strict';

const preprocessor = require('./lib');

// enable buld-in preprocessors
preprocessor.use('mentions', 'emotions', 'links');

// adding custom preprocessor
preprocessor.use({
    name: 'words',
    matcher(message) {
        message = message || '';

        const uniqueWords = Array.from(new Set(message.split(/\s/)));

        return {
            unique: uniqueWords,
            count : uniqueWords.length
        };
    }
});

const message = process.argv[2];

console.log('Input:', message);

preprocessor.onMessage(message).then((context) => {
    console.log('Output:', context);
});
