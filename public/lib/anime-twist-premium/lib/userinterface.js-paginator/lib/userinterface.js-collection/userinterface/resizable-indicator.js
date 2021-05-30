UserInterface.model({
	name: "collection.resizable.indicator",
	method: UserInterface.appendChild,
	properties: {
		tagName: "div",
		className: "resizable-indicator",
		children: [
			{
				tagName: "div",
				className: "resizable-indicator-icon"
			}
		]
	}
})

/**
 * @param  {Element} element
 * @param  {Object}  application
 * @param  {string}  direction
 */
UserInterface.bind("collection.resizable.indicator", async function(element, application, direction) {

	if(direction === "horizontal") {
		element.style.cursor = "e-resize"
		element.style.bottom = "50%"
		element.style.right = "-12px"
	} else if(direction === "vertical") {
		element.style.cursor = "n-resize"
		element.style.right = "50%"
		element.style.bottom = "-12px"
	} else if(direction === "diagonal") {
		element.style.cursor = "nw-resize"
		element.style.right = "-12px"
		element.style.bottom = "-12px"
	}

	element.addEventListener("mousedown", (event) => {
		UserInterface.announce(application, "resizable start", { direction, x: event.clientX, y: event.clientY})
	})

})