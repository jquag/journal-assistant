const fs = require("fs");
const util = require('../util');

exports.action = (dayArg, options) => {
    const days = [];
    let dateInfo = util.parseDay(dayArg);

    days.push(dateInfo);

    if (options.plus && options.plus > 0) {
        for (let i=0; i<options.plus; i++) {
            dateInfo = dateInfo.next();
            days.push(dateInfo);
        }
    }

    if (options.minus && options.minus > 0) {
        for (let i=0; i<options.minus; i++) {
            dateInfo = dateInfo.prev();
            days.unshift(dateInfo);
        }
    }

    console.log('\n');
    for (const day of days) {
        if (fs.existsSync(day.path)) {
            const entryText = fs.readFileSync(day.path).toString();
            console.log(`---------- ${day.date.format('YYYY/MM/DD').header} ----------\n`.value);
            console.log(entryText);
        } else {
            console.log(`----- ${day.date.format('YYYY/MM/DD')}: NO ENTRY -----\n`.comment);
        }
        console.log();
    }
    console.log('\n');
};

exports.help = () => {
    console.log();
    console.log('  Examples:'.header);
    console.log();
    console.log('    #read today\'s entry'.comment);
    console.log('    ja read');
    console.log();
    console.log('    #read yesterday\'s entry in interactive mode'.comment);
    console.log('    ja read -i yesterday');
    console.log();
    console.log('    #read monday and the following three day\'s entries'.comment);
    console.log('    ja read --plus 3 monday');
    console.log();
    console.log('    #read an entry from a certain date and 2 days before it'.comment);
    console.log('    ja read --minus 2 2018/4/29');
    console.log();
    // console.log('  Interactive Mode:'.header);
    // console.log();
    // console.log('    After each day is printed the following key strokes can be used to print the next or previous day.');
    // console.log();
    // console.log(`    ${'j, <up>'.value} \t- print the previous day`);
    // console.log(`    ${'k, <down>'.value} \t- print the next day`);
    // console.log(`    ${'q, <esc>'.value} \t- quit interactive mode`);
    console.log();
};
