UserInterface.model({
	name: "collection.input_file",
	method: UserInterface.appendChild,
	callback: data => ({
		tagName: "input",
		type: "file",
		...(data && data.className && { className: data.className }),
		...(data && data.style && { style: data.style })
	})
})

/**
 * @param  {Element} element
 * @param  {Object}  application
 * @param  {Object}  control
 * @param  {string}  control.action The name of the event
 */
UserInterface.bind("collection.input_file", async function(element, application, control) {

	element.addEventListener("change", function(event) {
		UserInterface.announce(application, control.action, event.target.files[0])
	})

})