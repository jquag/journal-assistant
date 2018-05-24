# journal-assistant
CLI to assist in keeping a daily journal

## Install

npm install -g github.com:jquag/journal-assistant.git

## Usage:
ja [options] [command]

Options:

    -V, --version         output the version number
    -h, --help            output usage information

Commands:

    init                  initialize the current directory as the home for a journal
    open [day]            Creates/Opens a journal entry
    read [options] [day]  Read journal entries

## Command: open

Usage: open [options] [day]

Creates/Opens a journal entry

Options:

    -h, --help  output usage information

Examples:

    #create a new entry for today
    ja open

    #create a new entry for yesterday
    ja open yesterday

    #create a new entry for earlier in the week
    ja open monday

    #create a new entry for a past date
    ja open 2018/4/29

## Command: read
Usage: read [options] [day]

Read journal entries

Options:

    -p --plus [num]   read the specified day and the following [num] days
    -m --minus [num]  read the [num] days prior to the specified day as well as the specified day
    -h, --help        output usage information

Examples:

    #read today's entry
    ja read

    #read yesterday's entry in interactive mode
    ja read -i yesterday

    #read monday and the following three day's entries
    ja read --plus 3 monday

    #read an entry from a certain date and 2 days before it
    ja read --minus 2 2018/4/29
