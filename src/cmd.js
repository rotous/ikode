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
			--dir, -d         Extra directory to scan for images. Note: the [dir] in the command above is
			                  still necessary. Multiple --dir flags are possible.
            --out, -o         Name of output file
            --name, -n        Name of the object with the URLS (only when not using --json or --css)
            --important, -i   Add !important to the generated CSS rules (only when using --css)
            --ext, -e         A json file with 'css extensions' (object with keys equal to the image names,
                              and values a string or array of strings with css selectors that should also
                              have that value as background image. Only when using --css)
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
        ext: {
            type: 'string',
            alias: 'e',
        },
        yes: {
            type: 'boolean',
            alias: 'y',
        },
        verbose: {
            type: 'boolean',
            alias: 'v',
		},
		dir: {
			type: 'string',
			alias: 'd',
		}
    },
    autoHelp: true,
});
