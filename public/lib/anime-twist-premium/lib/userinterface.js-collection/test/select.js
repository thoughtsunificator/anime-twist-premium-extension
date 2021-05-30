const fs = require('fs')
const path = require('path')

const JSDOM = require("jsdom").JSDOM

const scriptsFile = [
	fs.readFileSync(path.resolve(__dirname, "../lib/userinterface.js/src/userinterface.js"), { encoding: "utf-8" }),
	fs.readFileSync(path.resolve(__dirname, "../userinterface/select.js"), { encoding: "utf-8" }),
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

	const options = [
		{
			text: "A",
			value: "1"
		},
		{
			text: "B",
			value: "2"
		}
	]
	const expected = '<select><option value="1">A</option><option value="2">B</option></select>'
	await window.UserInterface.runModel("collection.select", { parentNode: window.document.body, data: { options } })
	test.strictEqual(window.document.body.innerHTML, expected)

	test.done()
}

exports.change = async function (test) {
	test.expect(1)

	const application = {}
	let selectedValue
	const options = [
		{
			text: "A",
			value: "1"
		},
		{
			text: "B",
			value: "2"
		}
	]
	window.UserInterface.listen(application, "setSomething", function(value) {
		selectedValue = value
	})
	await window.UserInterface.runModel("collection.select", { parentNode: window.document.body, bindingArgs: [application, { action: "setSomething" }], data: { options } })
	const element = window.document.querySelector("select")
	element.options[1].selected = true
	element.dispatchEvent(new window.Event("change"))
	test.strictEqual(selectedValue, "2")

	test.done()
}
