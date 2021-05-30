UserInterface.model({
	name: "collection.label_checkbox",
	method: UserInterface.appendChild,
	callback: data => ({
		tagName: "label",
		...(data && data.text && { textContent: data.text }),
		...(data && data.className && { className: data.className }),
		...(data && data.style && { style: data.style }),
		children: [
			{
				tagName: "input",
				type: "checkbox"
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
UserInterface.bind("collection.label_checkbox", async function(element, application, control) {

	const checkboxNode = element.querySelector("input")

	UserInterface.listen(application, control.action, async (value) => {
		if(value === true) {
			checkboxNode.checked = true
		}
	})

	checkboxNode.addEventListener("click", (event) => {
		UserInterface.announce(application, control.action, checkboxNode.checked)
	})

})