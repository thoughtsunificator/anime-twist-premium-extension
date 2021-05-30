UserInterface.model({
	name: "collection.button",
	method: UserInterface.appendChild,
	callback: data => ({
		tagName: "button",
		...(data.text && { textContent: data.text }),
		...(data.className && { className: data.className }),
		...(data.style && { style: data.style })
	})
})

/**
 * @param  {Element} element
 * @param  {Object}  application
 * @param  {Object}  control
 * @param  {string}  control.action The name of the event
 * @param  {*}       control.value  The value that will be passed to the event listeners
 * @param  {boolean} control.active If true the button will be set to active when a certain event is announced.
 */
UserInterface.bind("collection.button", async function(element, application, control) {
	if(control.active === true) {
		UserInterface.listen(application, control.action, async function(value) {
			if(value === control.value) {
				element.classList.add("active")
			} else {
				element.classList.remove("active")
			}
		})
	}

	element.addEventListener("click", function() {
		UserInterface.announce(application, control.action, control.value)
	})

})