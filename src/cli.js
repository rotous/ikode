#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');

const cmd = require('./cmd.js');
const {errExit} = require('./utils.js');
const {createSpriteFile} = require('./processor.js');
const errors = require('./errors.js');

if ( cmd.input.length !== 1 ) {
	cmd.showHelp();
	errExit();
}

const input = cmd.input[0];
const output = cmd.flags['out'];
const verbose = cmd.flags['verbose'];
const json = cmd.flags['json'];

// Check input directory
let stats;
try {
	stats = fs.statSync(input);
} catch (err) {
	if ( err.code === 'ENOENT' ) {
		errExit('Input directory does not exist');
	}

	errExit('Cannot read input directory: ' + err);
}
if ( !stats.isDirectory() ) {
	errExit('Given input is not a directory');
}

// Check output file
let outFileExists = true;
try {
	stats = fs.statSync(output);
} catch (err) {
	if ( err.code === 'ENOENT' ) {
		outFileExists = false;
	}
}

if ( outFileExists ) {
	// Ask for permission to overwrite
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		prompt: '> '
	});
	rl.question('Output file exists. Do you want to overwrite it? [Y/n] ', answer => {
		if ( answer.toLocaleLowerCase() === 'y' || answer === '' ) {
			rl.close();
			createSpriteFile(input, output, {verbose, json});
		} else {
			errExit();
		}
	});
} else {
	createSpriteFile(input, output, {verbose, json});
}
