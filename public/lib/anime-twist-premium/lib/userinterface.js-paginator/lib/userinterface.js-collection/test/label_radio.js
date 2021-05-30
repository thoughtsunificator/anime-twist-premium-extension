const fs = require('fs')
const path = require('path')

const JSDOM = require("jsdom").JSDOM

const scriptsFile = [
	fs.readFileSync(path.resolve(__dirname, "../lib/userinterface.js/src/userinterface.js"), { encoding: "utf-8" }),
	fs.readFileSync(path.resolve(__dirname, "../userinterface/label_radio.js"), { encoding: "utf-8" }),
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

	const expected = '<label>Test<input type="radio" name="something" value="1"></label>'
	await window.UserInterface.runModel("collection.label_radio", { parentNode: window.document.body, bindingArgs: [{}, { action: "setSomething" }], data: { text: "Test", name: "something", value: "1" } })
	test.strictEqual(window.document.body.innerHTML, expected)

	test.done()
}

exports.click = async function (test) {
	test.expect(1)

	const application = {}
	let something
	window.UserInterface.listen(application, "setSomething", function(value) {
		something = value
	})
	await window.UserInterface.runModel("collection.label_radio", { parentNode: window.document.body, bindingArgs: [application, { action: "setSomething" }], data: { text: "Test", name: "something", value: "1" } })
	const element = window.document.querySelector("input")
	element.click()
	test.strictEqual(something, "1")

	test.done()
}
