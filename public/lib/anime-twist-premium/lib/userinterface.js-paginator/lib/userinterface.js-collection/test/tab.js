const fs = require('fs')
const path = require('path')

const JSDOM = require("jsdom").JSDOM

const scriptsFile = [
	fs.readFileSync(path.resolve(__dirname, "../lib/userinterface.js/src/userinterface.js"), { encoding: "utf-8" }),
	fs.readFileSync(path.resolve(__dirname, "../userinterface/tab.js"), { encoding: "utf-8" }),
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

	const expected = '<div>Tab 1</div>'
	await window.UserInterface.runModel("collection.tab", { parentNode: window.document.body, bindingArgs: [{}, { action: "tab set" }], data: { text: "Tab 1" } })
	test.strictEqual(window.document.body.innerHTML, expected)

	test.done()
}

exports.click = async function (test) {
	test.expect(1)

	const application = {}

	const expected = '<div>OK</div>'
	window.UserInterface.listen(application, "tab set", function(value) {
		element.textContent = "OK"
	})
	await window.UserInterface.runModel("collection.tab", { parentNode: window.document.body, bindingArgs: [application, { action: "tab set" }], data: { name: "" } })
	const element = window.document.querySelector("div")
	element.dispatchEvent(new window.Event('click'));
	test.strictEqual(window.document.body.innerHTML, expected)

	test.done()
}
