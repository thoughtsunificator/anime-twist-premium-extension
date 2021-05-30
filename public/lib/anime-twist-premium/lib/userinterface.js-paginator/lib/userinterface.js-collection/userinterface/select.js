UserInterface.model({
	name: "collection.select",
	method: UserInterface.appendChild,
	callback: data => ({
		tagName: "select",
		...(data && data.className && { className: data.className }),
		...(data && data.style && { style: data.style }),
		children: data.options.map(option => ({
			tagName: "option",
			textContent: option.text,
			value: option.value,
		}))
	})
})

/**
 * @param  {Element} element
 * @param  {Object}  application
 * @param  {Object}  control
 * @param  {string}  control.action The name of the event
 */
UserInterface.bind("collection.select", async function(element, application, control) {

	element.addEventListener("change", function(event) {
		UserInterface.announce(application, control.action, event.target.value)
	})

})