const fs = require('fs')
const path = require('path')

const JSDOM = require("jsdom").JSDOM

const scriptsFile = [
	fs.readFileSync(path.resolve(__dirname, "../lib/userinterface.js/src/userinterface.js"), { encoding: "utf-8" }),
	fs.readFileSync(path.resolve(__dirname, "../userinterface/input.js"), { encoding: "utf-8" }),
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

	const expected = '<input type="text">'
	await window.UserInterface.runModel("collection.input", { parentNode: window.document.body, data: { type: "text", value: "" } })
	test.strictEqual(window.document.body.innerHTML, expected)

	test.done()
}

exports.input = async function (test) {
	test.expect(1)

	let addedText
	const application = {}
	window.UserInterface.listen(application, "addText", function(value) {
		addedText = value
	})
	await window.UserInterface.runModel("collection.input", { parentNode: window.document.body, bindingArgs: [application, { action: "addText" }], data: { type: "text", value: ""} })
	const element = window.document.querySelector("input")
	element.value = "test"
	element.dispatchEvent(new window.Event("input"));
	test.strictEqual(addedText, "test")

	test.done()
}