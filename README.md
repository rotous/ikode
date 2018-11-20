# Ikode
Ikode is a tool to create a file with base64 encoded data uri's from a directory of png and/or svg images.

```
Usage: ikode [OPTIONS] [dir]

	OPTIONS
		--json, -j        Output a JSON file instead of a JavaScript file
		--css, -c         Output a CSS file instead of a JavaScript file (only when not using --json)
		--dir, -d         Extra directory to scan for images. Note: the [dir] in the command above is
		                  still necessary. Multiple --dir flags are possible.
		--out, -o         Name of output file
		--name, -n        Name of the object with the URLS (only when not using --json or --css)
		--important, -i   Add !important to the generated CSS rules (only when using --css)
		--file, -f        A json file with 'css extensions' (object with keys equal to the image names,
		                  and values a string or array of strings with css selectors that should also
		                  have that value as background image. Only when using --css)
		--yes, -y         Assume yes when prompted for a Yes/No answer
		--verbose, -v     Give verbose output
```

## Example
See the project in the `example` directory for an example.

## License
Ikode is licensed with the [AGPL 3.0 license](https://opensource.org/licenses/AGPL-3.0)