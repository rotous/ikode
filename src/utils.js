const chalk = require('chalk');

module.exports = {
	errExit: (msg) => {
		if ( msg ) {
			console.error(chalk.red('Error: ' + msg));
		}
		process.exit(1);
	},
}