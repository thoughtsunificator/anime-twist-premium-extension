UserInterface.model({
	name: "collection.resizable.preview",
	method: UserInterface.appendChild,
	properties: {
		tagName: "div",
		className: "resizable-preview"
	}
})

/**
 * @param  {Element} element
 * @param  {Object}  application
 * @param  {Object}  resizable
 */
UserInterface.bind("collection.resizable.preview", async function(element, application, resizable) {

	UserInterface.listen(application, "resizable end", async () => {
		element.style.display = "none"
	})

	UserInterface.listen(application, "resizable update", async (data) => {
		element.style.display = ""
		element.style.display = "block"
		element.style.width = data.width + "px"
		element.style.height = data.height + "px"
	})


	document.addEventListener("mouseup", (event) => {
		if(resizable.resizing === true) {
			UserInterface.announce(application, "resizable end", { x: event.clientX, y: event.clientY})
		}
	})

})