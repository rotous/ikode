# Ikode
Ikode is a tool to create a file with base64 encoded data uri's from a directory of png images.

```
Usage: ikode [OPTIONS] [dir]

	OPTIONS
		--json, -j        Output a JSON file instead of a JavaScript file
		--css, -c         Output a CSS file instead of a JavaScript file (only when not using --json)
		--out, -o         Name of output file
		--name, -n        Name of the object with the URLS (only when not using --json or --css)
		--important, -i   Add !important to the generated CSS rules (only when using --css)
		--yes, -y         Assume yes when prompted for a Yes/No answer
		--verbose, -v     Give verbose output
```