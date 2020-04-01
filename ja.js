#!/usr/bin/env node

const program = require('commander');
const init = require('./commands/init');
const open = require('./commands/open');
const read = require('./commands/read');
const find = require('./commands/find');
const tags = require('./commands/tags');
const colors = require('colors');

colors.setTheme({
    comment: ['dim', 'white'],
    header: 'magenta',
    error: 'red',
    value: 'cyan',
});

program.version('1.0.0')
    .description('CLI to help maintain a text-based journal.')
    .action(invalidCommand);

program.command('init')
    .description('initialize the current directory as the home for a journal')
    .action(init.action);

program.command('open [day]')
    .description('Creates/Opens a journal entry')
    .on('--help', open.help)
    .action(open.action);

program.command('read [day]')
    .description('Read journal entries')
    // .option('--interactive -i', 'run in interactive mode')
    .option('-p --plus [num]', 'read the specified day and the following [num] days')
    .option('-m --minus [num]', 'read the [num] days prior to the specified day as well as the specified day')
    .on('--help', read.help)
    .action(read.action);

program.command('find [term]')
  .description('Find lines in entries for the given search term')
  .option('-b --buffer [num]', 'include [num] characters before and after the term', 20)
  .on('--help', find.help)
  .action(find.action);

program.command('tags')
  .description('Shows a list of previously used tags. Tags start with a # and are followed by one or more numbers or letters.')
  .on('--help', tags.help)
  .action(tags.action);

// TODO JQ: add 'random' to open

// TODO JQ: read --interactive -i (n N 2n 2N q) colors, --count -c [number of days] [day=same as before plus 'random']

// TODO JQ: list days


program.parse(process.argv);

function invalidCommand(cmd) {
    console.log(`  Unknown command: \'${cmd}\'`.error);
    program.help();
}
