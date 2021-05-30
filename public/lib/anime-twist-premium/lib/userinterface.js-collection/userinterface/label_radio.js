UserInterface.model({
	name: "collection.label_radio",
	method: UserInterface.appendChild,
	callback: data => ({
		tagName: "label",
		...(data && data.text && { textContent: data.text }),
		...(data && data.className && { className: data.className }),
		...(data && data.style && { style: data.style }),
		children: [
			{
				tagName: "input",
				type: "radio",
				...(data && data.name && { name: data.name }),
				...(data && data.value && { value: data.value }),
			}
		]
	})
})

/**
 * @param  {Element} element
 * @param  {Object}  application
 * @param  {Object}  control
 * @param  {string}  control.action The name of the event
 */
UserInterface.bind("collection.label_radio", async function(element, application, control) {

	const radioNode = element.querySelector("input")

	UserInterface.listen(application, control.action, async (value) => {
		if(value === radioNode.value) {
			radioNode.checked = true
		}
	})

	radioNode.addEventListener("click", (event) => {
		UserInterface.announce(application, control.action, event.target.value)
	})

})