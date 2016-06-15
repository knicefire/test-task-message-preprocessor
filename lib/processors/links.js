'use strict';

const Promise = require('bluebird');
const fetch = require('node-fetch');

function getPageTitle(body) {
    const matchedTitle = body.match(/<title[^>]*>([^]+?)<\/title>/im);

    return matchedTitle && matchedTitle[1];
}

module.exports = {
    pattern: /(https?:\/\/[\w@:%._\+~#=?&\/]{3,256})/g,
    name: 'links',
    matcher(message) {
        const matched = message.match(this.pattern) || [];

        // get unique urls
        const urls = Array.from(new Set(matched));

        return Promise.reduce(urls, (result, url) => {
            return fetch(url)
                .then((resp) => {
                    return resp.text();
                })
                .then((body) => {
                    const title = getPageTitle(body)

                    result.push({ url, title });

                    return result;
                });
        }, []);
    }
}
