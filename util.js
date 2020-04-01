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

function* entryGen() {
    const years = fs.readdirSync('.').filter(f => f.match(/\d{4}/));
    for (const y of years) {
        for (const m of exports.months) {
            if (fs.existsSync(`./${y}/${m}`)) {
                const entries = fs.readdirSync(`./${y}/${m}`).filter(f => f.match(/\d{8}-entry.md/));
                for (const entry of entries) {
                    yield `./${y}/${m}/${entry}`;
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
