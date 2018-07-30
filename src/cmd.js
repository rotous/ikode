/**
 * This module defines the command line interface
 */

const meow = require('meow');

module.exports = meow(`
	Usage: ikode [OPTIONS] [dir]

		Create a JavaScript file with an object that contains a base64 encoded string for every image in the given directory.

		OPTIONS
			--json		Output a JSON file instead of a JavaScript file
			--out		Name of output file
			--name 		Name of the object with the URLS (only when not using --json)
			--verbose	Give verbose output
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
		name: {

		},
		verbose: {
			type: 'boolean',
			alias: 'v',
		}
	},
	autoHelp: true,
});
