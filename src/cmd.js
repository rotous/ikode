/**
 * This module defines the command line interface
 */

const meow = require('meow');

module.exports = meow(`
	Usage: ikode [OPTIONS] [dir]

		Create a JavaScript file with an object that contains a base64 encoded string for every image in the given directory.

		OPTIONS
			--json, -j        Output a JSON file instead of a JavaScript file
			--css, -c         Output a CSS file instead of a JavaScript file
			--out, -o         Name of output file
			--name, -n        Name of the object with the URLS (only when not using --json or --css)
			--important, -i   Add !important to the generated CSS rules (only when using --css)
			--yes, -y         Assume yes when prompted for a Yes/No answer
			--verbose, -v     Give verbose output
	`, {
	description: false,
	flags: {
		out: {
			type: 'string',
			alias: 'o',
			default: './base64urls.js',
		},
		json: {
			type: 'boolean',
			alias: 'j',
		},
		css: {
			type: 'boolean',
			alias: 'c',
		},
		name: {
			type: 'string',
			alias: 'n',
		},
		important: {
			type: 'boolean',
			alias: 'i'
		},
		yes: {
			type: 'boolean',
			alias: 'y',
		},
		verbose: {
			type: 'boolean',
			alias: 'v',
		}
	},
	autoHelp: true,
});
