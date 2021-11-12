"use strict";

function initScripts() {
	document.removeEventListener('DOMContentLoaded', initScripts);
	function init() {
		initAdaptive();
	}

	@@include('function.js')

	init();
}
document.addEventListener('DOMContentLoaded', initScripts);
