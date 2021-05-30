const fs = require('fs')
const path = require('path')

const JSDOM = require("jsdom").JSDOM

const scriptsFile = [
	fs.readFileSync(path.resolve(__dirname, "../lib/userinterface.js/src/userinterface.js"), { encoding: "utf-8" }),
	fs.readFileSync(path.resolve(__dirname, "../userinterface/label_checkbox.js"), { encoding: "utf-8" }),
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

	const expected = '<label>Test<input type="checkbox"></label>'
	await window.UserInterface.runModel("collection.label_checkbox", { parentNode: window.document.body, bindingArgs: [{}, { action: "setSomething" }], data: { text: "Test" } })
	test.strictEqual(window.document.body.innerHTML, expected)

	test.done()
}

exports.click = async function (test) {
	test.expect(1)

	const application = {}
	let enabled
	window.UserInterface.listen(application, "setSomething", function(value) {
		enabled = value
	})
	await window.UserInterface.runModel("collection.label_checkbox", { parentNode: window.document.body, bindingArgs: [application, { action: "setSomething" }], data: { text: "" } })
	const element = window.document.querySelector("input")
	element.click()
	test.strictEqual(enabled, true)

	test.done()
}
