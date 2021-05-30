const fs = require('fs')
const path = require('path')

const JSDOM = require("jsdom").JSDOM

const scriptsFile = [
	fs.readFileSync(path.resolve(__dirname, "../lib/userinterface.js/src/userinterface.js"), { encoding: "utf-8" }),
	fs.readFileSync(path.resolve(__dirname, "../userinterface/input_color.js"), { encoding: "utf-8" }),
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

	const expected = '<div><input class="color" type="color"><input class="input" type="text"></div>'
	await window.UserInterface.runModel("collection.input_color", { parentNode: window.document.body, bindingArgs: [{}, { action: "color set" }] })
	test.strictEqual(window.document.body.innerHTML, expected)

	test.done()
}

exports.input = async function (test) {
	test.expect(5)

	let colors = []
	const application = {}
	window.UserInterface.listen(application, "color set", function(value) {
		colors.push(value)
	})
	await window.UserInterface.runModel("collection.input_color", { parentNode: window.document.body, bindingArgs: [application, { action: "color set" }] })
	const colorInput = window.document.querySelector("input.color")
	const input = window.document.querySelector("input.input")
	colorInput.value = "#ffffff"
	colorInput.dispatchEvent(new window.Event("input"));
	test.strictEqual(colorInput.value, "#ffffff")
	test.strictEqual(input.value, "#ffffff")
	input.value = "#000000"
	input.dispatchEvent(new window.Event("input"));
	test.strictEqual(colorInput.value, "#000000")
	test.strictEqual(input.value, "#000000")
	test.deepEqual(colors, ["#ffffff", "#000000"])

	test.done()
}