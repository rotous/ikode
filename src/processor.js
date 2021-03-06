const path = require('path');
const fs = require('fs');

const {errExit} = require('./utils.js');
const errors = require('./errors.js');

let extensions;
let config;

const toBase64URL = (src) => {
	// Only support png and svg for now
	const ext = src.substr(src.length - 4).toLowerCase();
	if ( ext !== '.png' &&  ext !== '.svg' ) {
		throw errors.ERR_NO_VALID_IMAGE;
	}

	let file;
	try {
		file = fs.readFileSync(src);
	} catch (err) {
		throw errors.ERR_FILE_NOT_FOUND;
	}

	if ( ext === '.png' ) {
		return 'data:image/png;base64,' + file.toString('base64');
	}

	// Also base64 encode svgs, because otherwise we will run into problem with IE11
	const svg = file.toString()
		.replace(/"/g, '\'')
		.replace(/[\r\n]+/g, '')
		.replace(/[\t\s]+/g, ' ');

	return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
};

const parseExtensionFile = (filename) => {
	try {
		let extensions = fs.readFileSync(filename);
		return JSON.parse(extensions.toString());
	} catch (err) {
		errExit('Unable to parse CSS extension file: ', err);
	}

	return extensions;
};

const getExtension = (className) => {
	if ( !config.ext ) {
		return '';
	}

	if ( !extensions ) {
		extensions = {};
		config.ext.forEach(file => {
			extensions = Object.assign(extensions, parseExtensionFile(file));
		});
	}

	if ( !extensions[className] ) {
		return '';
	}

	if ( typeof extensions[className] === 'string' ) {
		return ', ' + extensions[className];
	}

	if ( Array.isArray(extensions[className]) ) {
		let extension = '';
		extensions[className].forEach(ext => {
			if ( typeof ext === 'string' ) {
				extension += ', ' + ext;
			}
		});
		return extension;
	}

	return '';
};

const createSpriteFile = (inDir, outFile, options={}) => {
	config = options;
	const name = options.name || 'base64sprite';
	let files = [];
	inDir.forEach(d => {
		let items = fs.readdirSync(d);
		items.forEach(item => files.push(d + path.sep + item));
	});
	let tpl = "window." + name + " = Object.assign(window." + name + " || {}, {\n<<FILES>>\n});";
	if ( options.json ) {
		tpl = "{\n<<FILES>>\n}";
	} else if ( options.css ) {
		tpl = '<<FILES>>';
	}
	let filesString = [];

	files.forEach(file => {
		try {
			if ( options.verbose ) {
				console.log('encoding ' + file);
			}
			const ext = file.substr(file.lastIndexOf('.') + 1).toLowerCase();
			const url = toBase64URL(file);
			const className = '.' + path.basename(file).substr(0, path.basename(file).length - 4);
			const extension = options.ext ? getExtension(className) : '';
			if ( options.css ) {
				let imp = options.important ? ' !important' : '';
				filesString.push(`${className + extension} {background-image: url(${url})${imp}; background-repeat: no-repeat${imp}; background-position: center center${imp};}`);
			} else {
				filesString.push("\t\"" + className + extension + '": "' + url + '"');
			}
		} catch (err) {
			console.log('Error encoding ' + file + ': ' + err);
		}
	});
	const urlCount = filesString.length;
	filesString = filesString.join(options.css ? "\n" : ",\n");

	if ( options.verbose ) {
		console.log(`Writing ${urlCount} URLs to ${outFile}`);
	}
	try {
		fs.writeFileSync(outFile, tpl.replace('<<FILES>>', filesString));
	} catch (err) {
		errExit('Couldn\'t write ' + outFile + "\n" + err);
	}
};

module.exports = {
	toBase64URL,
	createSpriteFile,
};