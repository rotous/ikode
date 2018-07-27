/**
 * This script takes a directory with png images as input and creates
 * a javascript file that contains these png images as base64 encoded
 * urls.
 */

const fs = require('fs');
const readline = require('readline');

function errExit(msg) {
	console.error('Error: ' + msg);
	process.exit(1);
}

const args = process.argv.slice(2);
const flags = {};
const params = [];
let skip = false;
args.forEach((arg, i) => {
	if ( skip ) {
		skip = false;
		return;
	}
	if ( arg.substr(0,2) === '--' ) {
		flags[arg] = args.length > i + 1 ? args[i + 1] : undefined;
		skip = true;
	} else if ( arg.substr(0,1) === '-' ) {
		flags[arg] = args.length > i + 1 ? args[i + 1] : undefined;
		skip = true;
	} else {
		params.push(arg);
	}
});
if ( flags['--in'] === undefined ) {
	errExit('Input directory not specified');
}
if ( flags['--out'] === undefined ) {
	errExit('Output file not specified');
}

let stats;
try {
	stats = fs.statSync(flags['--in']);
} catch (err) {
	errExit('Cannot read input directory');
}
if ( !stats.isDirectory() ) {
	errExit('Given input directory is not a directory');
}

let outFileExists = true;
try {
	stats = fs.statSync(flags['--out']);
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
			writeSpriteFile(flags['--in'], flags['--out']);
		} else {
			errExit('Bye!');
		}
	});
} else {
	writeSpriteFile(flags['--in'], flags['--out']);
}

function writeSpriteFile(inDir, outFile) {
	console.log('writing sprite...');
	const files = fs.readdirSync(inDir);
	const outputTpl = "window.base64sprite = Object.assign(window.base64sprite || {}, {\n<<FILES>>\n});";
	let filesString = [];
	files.forEach(file => {
		if ( file.substr(file.length - 4) !== '.png' ) {
			return;
		}
		const f = fs.readFileSync(flags['--in'] + '/' + file);
		filesString.push("\t\"" + file.substr(0, file.length - 4) + '": "data:image/png;base64,' + f.toString('base64') + '"');
	});
	filesString = filesString.join(",\n");
	fs.writeFileSync(outFile, outputTpl.replace('<<FILES>>', filesString));
}