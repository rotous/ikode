const fs = require('fs');

const {errExit} = require('./utils.js');
const errors = require('./errors.js');

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

const createSpriteFile = (inDir, outFile, options={}) => {
	const files = fs.readdirSync(inDir);
	let tpl = "window.base64sprite = Object.assign(window.base64sprite || {}, {\n<<FILES>>\n});";
	if ( options.json ) {
		tpl = "{\n<<FILES>>\n}";
	}
	let filesString = [];
	files.forEach(file => {
		try {
			if ( options.verbose ) {
				console.log('encoding ' + inDir + file);
			}
			const url = toBase64URL(inDir + file);
			filesString.push("\t\"" + file.substr(0, file.length - 4) + '": "' + url + '"');
		} catch (err) {
			console.log('Error encoding ' + file + ': ' + err);
		}
	});
	const urlCount = filesString.length;
	filesString = filesString.join(",\n");

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