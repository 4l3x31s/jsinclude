module.exports = include;

include.pending = 0;
include.onready = [];
include.includes = {};
include.queue = [];

/* This include function implements a queued loading mechanism
 * to ensure that script files are loaded in the same order as
 * they are defined in script. This helps with some issues of 
 * loading jquery plugins before jquery is actually loaded.
 */

function include(a, onload) {
	if (typeof(a) === 'function') {
		if (include.pending == 0) {
			include.ready();

			return true;
		}
		else {
			include.onready.push(a)
			return false;
		}
	}

	var path = a;

	include.includes[path.toLowerCase()] = { loaded : false };

	var scr = document.createElement('script');

	scr.onload = scr.onreadystatechange = function (ev) {
		var cont = false;

		if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
			cont = true;
		}

		if (cont) {
			include.pending -= 1;

			if (onload) {
				onload();
			}

			if (include.queue.length) {
				var queuedScr = include.queue.shift();

				document.getElementsByTagName('head')[0].appendChild(queuedScr);
				include.pending += 1;
			}

			if (include.pending == 0) {
				include.ready();
			}
		}
	};

	scr.setAttribute('src',path);
	scr.setAttribute('language', 'javascript');
	scr.setAttribute('type', 'text/javascript');

	if (!include.pending) {
		//just load this right away
		document.getElementsByTagName('head')[0].appendChild(scr);
		include.pending += 1;
	}
	else {
		//queue loading until the previous include file is loaded
		include.queue.push(scr);
	}
}

include.once = function (path, onload) {
	if (include.includes[path.toLowerCase()]) {
		//file is already included;
		if (onload) {
			onload();
		}
	}
	else {
		include(path, onload);
	}
}

include.ready = function () {
	for (var x = 0; x < include.onready.length; x += 1) {
		include.onready[x]();
	}
}

include.css = function (path) {
	var head = document.getElementsByTagName('head')[0];
	var link = document.createElement('link');
	link.rel = "stylesheet"
	link.type = "text/css"
	link.href = path;

	head.appendChild(link);
}
