const fs = require('fs')
const path = require('path')

const JSDOM = require("jsdom").JSDOM

const scriptsFile = [
	fs.readFileSync(path.resolve(__dirname, "../lib/userinterface.js/src/userinterface.js"), { encoding: "utf-8" }),
	fs.readFileSync(path.resolve(__dirname, "../userinterface/resizable-indicator.js"), { encoding: "utf-8" }),
]

let window

exports.setUp = async function(callback) {
	window = (new JSDOM(``, { runScripts: "dangerously" })).window
	for(const scriptFile of scriptsFile) {
		const scriptNode = window.document.createElement("script")
		scriptNode.textContent = scriptFile
		window.document.head.appendChild(scriptNode)
	}
	callback()
}

exports.model = async function (test) {
	test.expect(1)

	const expected = '<div class="resizable-indicator"><div class="resizable-indicator-icon"></div></div>'
	await window.UserInterface.runModel("collection.resizable.indicator", { parentNode: window.document.body })
	test.strictEqual(window.document.body.innerHTML, expected)

	test.done()
}
