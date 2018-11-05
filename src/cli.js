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

let input = cmd.input[0];
if ( input[input.length-1] === '/' || input[input.length-1] === '\\' ) {
	input = input.substring(0, input.length -1);
}
const output = cmd.flags['out'];
const extensionfile = cmd.flags['ext'];
const verbose = cmd.flags['verbose'];
const json = cmd.flags['json'];
const css = !json && cmd.flags['css'];
const important = css && cmd.flags['important'];
const yes = cmd.flags['yes'];
const name = cmd.flags['name'];
let dir = cmd.flags['dir'];
if ( !dir ) {
	dir = [input];
} else if ( typeof dir === 'string' ) {
	dir = [dir, input]
} else if ( Array.isArray(dir) ) {
	dir = dir.concat(input);
}
// filter duplicates
dir = dir.filter((value, index, dir) => dir.indexOf(value) === index);

// Check input directories
let stats;
dir.forEach(d => {
	try {
		stats = fs.statSync(d);
	} catch (err) {
		if ( err.code === 'ENOENT' ) {
			errExit('Input directory `' + d + '` does not exist');
		}

		errExit('Cannot read input directory `' + d + '`: ' + err);
	}
	if ( !stats.isDirectory() ) {
		errExit('Given input `' + d + '` is not a directory');
	}
});

// Check file with css extensions
if ( extensionfile ) {
	try {
		stats = fs.statSync(extensionfile);
	} catch (err) {
		if ( err.code === 'ENOENT' ) {
			errExit('File with CSS extensions does not exist');
		}

		errExit('Cannot read file with CSS extensions: ' + err);
	}
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

if ( outFileExists && !yes ) {
	// Ask for permission to overwrite
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		prompt: '> '
	});
	rl.question(`Output file ${output} exists. Do you want to overwrite it? [Y/n] `, answer => {
		if ( answer.toLocaleLowerCase() === 'y' || answer === '' ) {
			rl.close();
			createSpriteFile(dir, output, {verbose, json, css, important, name, ext: extensionfile});
		} else {
			errExit();
		}
	});
} else {
	createSpriteFile(dir, output, {verbose, json, css, important, name, ext: extensionfile});
}
