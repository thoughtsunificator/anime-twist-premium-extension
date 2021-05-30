UserInterface.model({
	name: "collection.input",
	method: UserInterface.appendChild,
	callback: data => ({
		tagName: "input",
		...(data.type && { type: data.type }),
		...(data.value && { value: data.value }),
		...(data.className && { className: data.className }),
		...(data.style && { style: data.style })
	})
})

/**
 * @param  {Element} element
 * @param  {Object}  application
 * @param  {Object}  control
 * @param  {string}  control.action The name of the event
 */
UserInterface.bind("collection.input", async function(element, application, control) {

	element.addEventListener("input", function(event) {
		UserInterface.announce(application, control.action, event.target.value)
	})

})