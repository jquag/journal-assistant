const fs = require("fs");
const util = require('../util');
const moment = require('moment');

exports.action = (term, options) => {
    if (!term) {
        console.log('  A search term is required'.error);
        return exports.help();
    }
    for (const entry of util.entries({reverse: false})) {
        const contents = fs.readFileSync(entry.path).toString();
        const match = contents.match(new RegExp(`(${term})`, 'ig'));
        if (match) {
            const date = entry.date.format("YYYY-MM-DD");
            console.log(`\n  ${date}`.header);
            let lastIndex = -1;
            for (let mi=0; mi<match.length; mi++) {
                const matchedTerm = match[mi];
                const i = contents.indexOf(matchedTerm, lastIndex+1);
                lastIndex = i;
                const matchedContent = contents.substring(Math.max(i-options.buffer, 0), Math.min(i+(+options.buffer)+matchedTerm.length, contents.length)).replace(/\n/g, ' ');
                console.log(`  ...${matchedContent}...`);
            }
        }
    }
};

exports.help = () => {
    console.log();
    console.log('  Example:'.header);
    console.log();
    console.log('    # find lines in entries that mention the name Winston'.comment);
    console.log('    ja find "Winston"');
    console.log();
    console.log();
};
