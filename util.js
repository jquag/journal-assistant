const moment = require('moment');
const fs = require('fs');

exports.parseDay = (day) => {
    let date;
    day = (day || 'today').toLowerCase();
    switch (day) {
        case 'today':
            date =  moment();
            break;
        case 'yesterday':
            date = moment().subtract(1, 'days');
            break;
        case 'sunday':
        case 'monday':
        case 'tuesday':
        case 'wednesday':
        case 'thursday':
        case 'friday':
        case 'saturday':
            date = rollBackToDay(day);
            break;
        case 'last':
            date = moment(lastEntryDate().date);
            break;
        default:
            date = moment(day);
    }

    if (!date.isValid()) {
        throw new Error(`Invalid Date: ${day}`);
    }
    return toDateInfo(date);
};

exports.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

exports.entries = entryGen;

function* entryGen(opts={reverse: true, fromDate: null}) {
    const years = fs.readdirSync('.').filter(f => f.match(/\d{4}/));
    years.sort();
    if (opts.reverse) {
        years.reverse();
    }
    const months = [...exports.months];
    if (opts.reverse) {
        months.reverse();
    }
    for (const y of years) {
        const validYear = opts.fromDate ? (opts.reverse ? opts.fromDate.year() >= y : opts.fromDate.year() <= y) : true
        if (validYear) {
            for (const m of months) {
                const currMonth = moment(`${y}-${m}`, 'YYYY-MMM');
                if (!opts.reverse) {
                    currMonth.endOf('month');
                }
                const validMonth = opts.fromDate ? (opts.reverse ? opts.fromDate.isSameOrAfter(currMonth) : opts.fromDate.isSameOrBefore(currMonth)) : true;
                if (validMonth) {
                    if (fs.existsSync(`./${y}/${m}`)) {
                        const entries = fs.readdirSync(`./${y}/${m}`).filter(f => f.match(/\d{8}-entry.md/));
                        entries.sort();
                        if (opts.reverse) {
                            entries.reverse();
                        }
                        for (const entry of entries) {
                            const curr = moment(entry.slice(-17, -9));
                            if (!opts.reverse) {
                                curr.endOf('day');
                            }
                            const valid = opts.fromDate ? (opts.reverse ? opts.fromDate.isSameOrAfter(curr) : opts.fromDate.isSameOrBefore(curr)) : true;
                            if (valid) {
                                yield toDateInfo(moment(curr));
                            }
                        }
                    }
                }
            }
        }
    }
}

function toDateInfo(date) {
    return {
        date,
        dateStr: date.format('YYYYMMDD'),
        year: date.year(),
        month: date.format('MMM'),
        path: `${date.year()}/${date.format('MMM')}/${date.format('YYYYMMDD')}-entry.md`,
        next,
        prev
    }
}

function next() {
    return toDateInfo(moment(this.date).add(1, 'days'));
}

function prev() {
    return toDateInfo(moment(this.date).subtract(1, 'days'));
}

function rollBackToDay(dayOfWeek) {
    let date = moment();
    while (date.format('dddd').toLowerCase() !== dayOfWeek) {
        date = date.subtract(1, 'days');
    }
    return date;
}

function lastEntryDate() {
    const lastEntry = entryGen().next().value;
    console.log('-->', lastEntry.dateStr);
    return lastEntry;
}
