UserInterface.model({
	name: "collection.input_color",
	method: UserInterface.appendChild,
	callback: data => ({
		tagName: "div",
		...(data && data.className && { className: data.className }),
		...(data && data.style && { style: data.style }),
		children: [
			{
				className: "color",
				tagName: "input",
				type: "color"
			},
			{
				className: "input",
				tagName: "input",
				type: "text",
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
UserInterface.bind("collection.input_color", async function(element, application, control) {

	const colorNode = element.querySelector(".color")
	const inputNode = element.querySelector(".input")

	UserInterface.listen(application, control.action, async (value) => {
		inputNode.value = value
		colorNode.value = value
	})

	colorNode.addEventListener("input", () => {
		inputNode.value = colorNode.value
		UserInterface.announce(application, control.action, colorNode.value)
	})

	inputNode.addEventListener("input", () => {
		colorNode.value = inputNode.value
		UserInterface.announce(application, control.action, colorNode.value)
	})

})