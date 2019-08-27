const fs = require('fs');
const opts = require('./cli-opts');
const path = require('path');
const readline = require('readline');

/**
 * @description Global content for output file
 */
let basePath = '';
let content = [];

/**
 * @description Adds required files
 * @return {Boolean}
 * @param {String} filename
 */
function addRequired(filename) {
	const required = parseFile(filename);

	if (required) {
		content.unshift(required);
	}
	return !!required;
}

/**
 * @description Reads file one line at a time and adds required files to the content.
 * @return {String}
 * @param {String} infile
 */
function parseFile(infile) {
	try {
		let output = '';
		let commentOpen = false;
		
		const fn = path.join(basePath, infile);
		const endComment = /\*\//;
		const startComment = /\/\*/;

		const lines = fs.readFileSync(fn, 'utf8').split('\n');

		lines.forEach((line) => {
			line = line.replace(/module.exports\s*=\s*/, '');

			if (commentOpen && endComment.test(line)) {
				commentOpen = false;
				line = line.replace(/^[\w\W]*\*\//, '');
			} else if (startComment.test(line) && endComment.test(line)) {
				line = line.replace(/\/\*[\w\W]*\*\//, '');
			} else if (startComment.test(line)) {
				commentOpen = true;
				line = line.replace(/\/\*[\w\W]*/, '');
			}

			if (!commentOpen) {
				const required = /\brequire\(([^)]+)\)[,;]/.exec(line);

				if (required) {
					if (!addRequired(required[1].replace(/^['"]|['"]$/g, ''))) {
						output += line.replace(/\/\/[^\n]*([\n]|$)/, '');
					}
				} else {
					output += line.replace(/\/\/[^\n]*([\n]|$)/, '');
				}
			}
		});

		return output;
	} catch (err) {
		console.error(err);
	}
}

// controller

const {
	args,
	command,
} = opts;
const i = args.i || args.in;

if (args.h || args.help || !i) {
	console.log(`
		Syntax: ${command} -[-]i[n] FILENAME [-[-]o[ut] FILENAME]

		-[-]i[n] FILENAME	 Sets the input filename. Required
		-[-]o[ut] FILENAME	Sets the output filename.
		`);
} else {
	const iFile = path.parse(i);
	const oFile = path.parse(args.o || args.out || i);

	basePath = iFile.dir;

	// normalize the output base
	if (!/\bmin\b/.test(oFile.base)) {
		oFile.base = `${oFile.name}.min${oFile.ext}`;
	}

	content.push(parseFile(`${iFile.base}`));

	// update the contents
	content = content.map((str) => str.replace(/\s+/g, ' ')
			.replace(/\s*{\s*/g, '{').replace(/\s*}\s*/g, '}'))
		.join('');

	fs.writeFileSync(`${path.join(oFile.dir, oFile.base)}`, content);
}
