const fs = require('fs')
const path = require('path')

const JSDOM = require("jsdom").JSDOM

const scriptsFile = [
	fs.readFileSync(path.resolve(__dirname, "../lib/userinterface.js/src/userinterface.js"), { encoding: "utf-8" }),
	fs.readFileSync(path.resolve(__dirname, "../userinterface/input_file.js"), { encoding: "utf-8" }),
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

	const expected = '<input type="file">'
	await window.UserInterface.runModel("collection.input_file", { parentNode: window.document.body })
	test.strictEqual(window.document.body.innerHTML, expected)

	test.done()
}

exports.input = async function (test) {
	test.expect(1)

	let files = []
	const application = {}
	const blob = new window.Blob([""], { type: "text/html" })
	blob["lastModifiedDate"] = ""
	blob["name"] = "filename"
	const expected = '<input type="file">'
	window.UserInterface.listen(application, "upload", function(value) {
		files.push(value)
	})
	await window.UserInterface.runModel("collection.input_file", { parentNode: window.document.body, bindingArgs: [application, { action: "upload" }]})
	const element = window.document.querySelector("input")
	Object.defineProperty(element, 'files', {
		 value: [blob],
		 writeable: true,
	 })
	element.dispatchEvent(new window.Event("change"))
	test.deepEqual(files, element.files)

	test.done()
}
