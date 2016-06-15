'use strict';

module.exports = {
    pattern: /\((\w{1,15})\)/g,
    name: 'emotions',
    matcher(message) {
        let matches;
        const values = [];

        while (matches = this.pattern.exec(message)) {
            values.push(matches[1]);
        }

        // return unique only values
        return Array.from(new Set(values));
    }
}
