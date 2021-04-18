const fs = require("fs");
const util = require('../util');
const moment = require('moment');

exports.action = (dayArg, options) => {
    const days = [];
    let dateInfo = util.parseDay(dayArg);

    days.push(dateInfo);

    if (options.plus && options.plus > 0) {
        let count = 0;
        let entries = util.entries({reverse: false, fromDate: moment(dateInfo.date).add(1, 'days')});
        let result = entries.next();
        while (count < options.plus && result.value) {
            days.push(result.value);
            result = entries.next()
            count++;
        }
    }

    if (options.minus && options.minus > 0) {
        let count = 0;
        let entries = util.entries({reverse: true, fromDate: moment(dateInfo.date).subtract(1, 'days')});
        let result = entries.next();
        while (count < options.minus && result.value) {
            days.unshift(result.value);
            result = entries.next()
            count++;
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
};

exports.help = () => {
    console.log();
    console.log('  Examples:'.header);
    console.log();
    console.log('    #read today\'s entry'.comment);
    console.log('    ja read');
    console.log();
    console.log('    #read yesterday\'s entry'.comment);
    console.log('    ja read -i yesterday');
    console.log();
    console.log('    #read monday and the following three day\'s entries'.comment);
    console.log('    ja read --plus 3 monday');
    console.log();
    console.log('    #read an entry from a certain date and 2 days before it'.comment);
    console.log('    ja read --minus 2 2018/4/29');
    console.log();
    console.log();
};
