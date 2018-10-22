const path = require('path');
const fs = require('fs');

const {errExit} = require('./utils.js');
const errors = require('./errors.js');

let extensions;
let config;

const toBase64URL = (src) => {
	if ( src.substr(src.length - 4) !== '.png' ) {
		throw errors.ERR_NO_VALID_IMAGE;
	}

	let file;
	try {
		file = fs.readFileSync(src);
	} catch (err) {
		throw errors.ERR_FILE_NOT_FOUND;
	}

	return 'data:image/png;base64,' + file.toString('base64');
};

const parseExtensionFile = (filename) => {
	try {
		extensions = fs.readFileSync(filename);
		extensions = JSON.parse(extensions);
	} catch (err) {
		errExit('Unable to parse CSS extension file: ', err);
	}

	return extensions;
};

const getExtension = (className) => {
	if ( !config.file ) {
		return '';
	}

	if ( !extensions ) {
		parseExtensionFile(config.file);
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
			const url = toBase64URL(file);
			const className = '.' + path.basename(file).substr(0, file.length - 4);
			const extension = options.file ? getExtension(className) : '';
			if ( options.css ) {
				filesString.push(`${className + extension} {background: url(${url}) no-repeat center center${options.important ? ' !important' : ''};}`);
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