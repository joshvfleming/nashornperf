# Nashorn Perf

This is a test app for measuring render performance in Nashorn.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)

## Installation

* `git clone git@github.com:joshvfleming/nashornperf.git` this repository
* change into the new directory
* `npm install`
* `bower install`
* Select "ember#canary" in the previous step if given an option.

## Running

First, build the client app in prod mode.

`ember build -prod`

Then run the performance test by running the following script:

`jrunscript -J-server scripts/test.js`

This will write a csv with timing data when finished.
