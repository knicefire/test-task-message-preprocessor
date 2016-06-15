'use strict';

module.exports = {
    pattern: /(?:^|\s)@(([\w\d\.\-@]){1,})/g,
    name: 'mentions',
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
