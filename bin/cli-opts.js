/**
 * author: hrobertking@cathmhoal.com
 *
 * @requires path
 *
 * @exports parse as parse
 * @exports __args as args
 * @exports __command as command
 */
var path = require('path'),
	__args,
	__command;

/**
 * @description The named arguments passed in
 * @type		 {object}
 */
Object.defineProperty(exports, 'args', {
	get: function() {
		return __args;
	},
	set: function(value) {
		// READ-ONLY
	}
});

/**
 * @description The command used
 * @type {String}
 */
Object.defineProperty(exports, 'command', {
	get: function() {
		return __command;
	},
	set: function(value) {
		// READ-ONLY
	}
});

/**
 * Parses the array of arguments passed and returns an object
 *
 * @return	 {object}
 *
 * @param		{string[]} args
 *
 * @example	node index.js --port 9090 -u hrobertking --password foobar -> cli.parse(process.argv.slice(2)) -> { 'password':'foobar', 'port':'9090', 'u':'hrobertking' }
 */
function parse(args) {
	var isfirst = true
		, arg_l
		, arg_s
		, value
		, obj = { argv:[ ] }
	;

	// drop 'node'
	args.shift();

	// set the command
	__command = args.shift().replace(process.cwd()+path.sep, '');

	/* Loop through all the options args */
	while (args.length) {
		arg_l = /^\-{2}(\S+)/.exec(args[0]);	/* long arg format	*/
		arg_s = /^\-{1}(\S+)/.exec(args[0]);	/* short arg format */
		if (arg_l) {
			if (arg_l[1].indexOf(':') > -1) {
				/* we have data in the argument, e.g., --foo:bar */
				obj[arg_l[1].split(':')[0]] = arg_l[1].split(':')[1];
				obj.argv.push(args[0]);
				args.splice(0, 1);
			} else if (arg_l[1].indexOf('=') > -1) {
				/* we have data in the argument, e.g., --foo=bar */
				obj[arg_l[1].split('=')[0]] = arg_l[1].split('=')[1];
				obj.argv.push(args[0]);
				args.splice(0, 1);
			} else if (!(/^\-{2}(\S+)/).test(args[1]) && !(/^\-{1}(\S+)/).test(args[1])) {
				/**
				 * there is data passed in, but it's not identfied
				 * by anything other than proximity, so get the
				 * current value for the arg and add this value to
				 * it, then store the values in the property of the
				 * object, but assume it's a flag if the value is
				 * empty
				 */
				value = (obj[arg_l[1]] || '').split(',');
				value.push(args[1]);
				obj[arg_l[1]] = value.join(',').replace(/^\,/, '').replace(/\,$/, '');
				obj[arg_l[1]] = obj[arg_l[1]].length ? obj[arg_l[1]] : true;
				obj.argv.push(args[0]);
				args.splice(0, 1);
				obj.argv.push(args[0]);
				args.splice(0, 1);
			} else {
				/* there isn't data passed in, so set the flag to true */
				obj[arg_l[1]] = true;
				obj.argv.push(args[0]);
				args.splice(0, 1);
			}
		} else if (arg_s) {
			/* split the 'small' arg name into letters */
			arg_l = arg_s[1]; /* keep the whole argument */
			arg_s = arg_s[1].split('');

			if (arg_l.indexOf(':') > -1) {
				/* we have data in the argument, e.g., -f:bar */
				arg_s = arg_l.split(':')[0].split('');
				for (value = 0; value < arg_s.length; value += 1) {
					obj[arg_s[value]] = (value === arg_s.length - 1) ? arg_l.split(':')[1] : true;
				}
				obj.argv.push(args[0]);
				args.splice(0, 1);
			} else if (arg_l.indexOf('=') > -1) {
				/* we have data in the argument, e.g., --foo=bar */
				arg_s = arg_l.split('=')[0].split('');
				for (value = 0; value < arg_s.length; value += 1) {
					obj[arg_s[value]] = (value === arg_s.length - 1) ? arg_l.split('=')[1] : true;
				}
				obj.argv.push(args[0]);
				args.splice(0, 1);
			} else if (arg_s.length > 1) {
				/**
				 * if the arg is more than one letter, then loop
				 * through the letters and set each to the presented
				 * value or true
				 */
				for (value = 0; value < arg_s.length; value += 1) {
					obj[arg_s[value]] = true;
				}
				obj.argv.push(args[0]);
				args.splice(0, 1);
			} else if (!(/^\-{2}(\S+)/).test(args[1]) && !(/^\-{1}(\S+)/).test(args[1])) {
				/**
				 * there is data passed in, but it's not identfied
				 * by anything other than proximity, so get the
				 * current value for the arg and add this value to
				 * it, then store the values in the property of the
				 * object, but assume it's a flag if the value is
				 * empty
				 */
				value = (obj[arg_s[0]] || '').split(',');
				value.push(args[1]);
				obj[arg_s[0]] = value.join(',').replace(/^\,/, '').replace(/\,$/, '');
				obj[arg_s[0]] = obj[arg_s[0]].length ? obj[arg_s[0]] : true;
				obj.argv.push(args[0]);
				args.splice(0, 1);
				obj.argv.push(args[0]);
				args.splice(0, 1);
			} else {
				/* there isn't data passed in, so set the flag to true */
				obj[arg_s[0]] = true;
				obj.argv.push(args[0]);
				args.splice(0, 1);
			}
		} else {
			/**
			 * get the current value for the unnamed arguments
			 * and add this value to it, then store the values
			 * in the property of the object
			 */
			value = (obj._unnamed || '').split(',');
			value.push(args[0]);
			obj._unnamed = value.join(',').replace(/^\,/, '').replace(/\,$/, '');
			obj.argv.push(args[0]);
			args.splice(0, 1);
		}
		isfirst = false;
	}

	return obj;
}
exports.parse = parse;

__args = parse(process.argv);
