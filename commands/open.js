const fs = require('fs');
const child_process = require('child_process');
const util = require('../util');

const editor = process.env.EDITOR || 'vim';

exports.action = (dayArg, options) => {
    const dateInfo = util.parseDay(dayArg);

    if (!fs.existsSync(`./${dateInfo.year}`)) {
        console.log('  creating folder for year: ' + `${dateInfo.year}`.value);
        fs.mkdirSync(`./${dateInfo.year}`);
    }

    if (!fs.existsSync(`./${dateInfo.year}/${dateInfo.month}`)) {
        console.log('  creating folder for month: ' + `${dateInfo.year}/${dateInfo.month}`.value);
        fs.mkdirSync(`./${dateInfo.year}/${dateInfo.month}`);
    }

    if (!fs.existsSync(dateInfo.path)) {
        console.log('  creating entry: ' + dateInfo.path.value);
        fs.openSync(dateInfo.path, 'a');
        fs.appendFileSync(dateInfo.path, `# ${dateInfo.date.format('YYYY-MM-DD')}`);
    }

    const child = child_process.spawn(editor, [dateInfo.path], {
        stdio: 'inherit'
    });

    child.on('exit', function (e, code) {
        console.log('  FINISHED'.header);
    });
};

exports.help = () => {
    console.log();
    console.log('  Examples:'.header);
    console.log();
    console.log('    #create a new entry for today'.comment);
    console.log('    ja open');
    console.log();
    console.log('    #create a new entry for yesterday'.comment);
    console.log('    ja open yesterday');
    console.log();
    console.log('    #create a new entry for earlier in the week'.comment);
    console.log('    ja open monday');
    console.log();
    console.log('    #create a new entry for a past date'.comment);
    console.log('    ja open 2018/4/29');
};
