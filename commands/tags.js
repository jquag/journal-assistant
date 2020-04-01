const fs = require("fs");
const util = require('../util');

exports.action = () => {
    const tags = new Set();
    for (const entry of util.entries()) {
        const contents = fs.readFileSync(entry).toString();
        const match = contents.match(new RegExp(`(#[0-9a-zA-Z]+)`, 'g'));
        if (match) {
            for (let mi=0; mi<match.length; mi++) {
                tags.add(match[mi]);
            }
        }
    }

    tags.forEach(t => console.log(`  ${t}`));
};

exports.help = () => {
    console.log();
    console.log('  Example:'.header);
    console.log();
    console.log('    # show list of previously used tags'.comment);
    console.log('    ja tags');
    console.log();
    console.log();
};
