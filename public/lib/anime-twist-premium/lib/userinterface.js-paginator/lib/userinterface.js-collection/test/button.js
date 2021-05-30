const fs = require('fs')
const path = require('path')

const JSDOM = require("jsdom").JSDOM

const scriptsFile = [
	fs.readFileSync(path.resolve(__dirname, "../lib/userinterface.js/src/userinterface.js"), { encoding: "utf-8" }),
	fs.readFileSync(path.resolve(__dirname, "../userinterface/button.js"), { encoding: "utf-8" }),
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

	const expected = '<button>Test</button>'
	await window.UserInterface.runModel("collection.button", { parentNode: window.document.body, bindingArgs: [{}, { active: false }], data: { text: "Test" } })
	test.strictEqual(window.document.body.innerHTML, expected)

	test.done()
}

exports.click = async function (test) {
	test.expect(1)

	const application = {}

	const expected = '<button>somevalue</button>'
	window.UserInterface.listen(application, "toggle", function(value) {
		element.textContent = value
	})
	await window.UserInterface.runModel("collection.button", { parentNode: window.document.body, bindingArgs: [application, { value: "somevalue", action: "toggle", active: false }], data: { text: "" } })
	const element = window.document.querySelector("button")
	element.dispatchEvent(new window.Event('click'));
	test.strictEqual(window.document.body.innerHTML, expected)
	test.done()
}


exports.active = async function (test) {
	test.expect(2)

	const application = {}

	await window.UserInterface.runModel("collection.button", { parentNode: window.document.body, bindingArgs: [ application, { value: "somevalue", action: "toggle", active: true }], data: { text: "text" } })
	await window.UserInterface.announce(application, "toggle", "somevalue")
	test.strictEqual(window.document.body.innerHTML, '<button class="active">text</button>')
	await window.UserInterface.announce(application, "toggle", "someothervalue")
	test.strictEqual(window.document.body.innerHTML, '<button class="">text</button>')
	test.done()
}