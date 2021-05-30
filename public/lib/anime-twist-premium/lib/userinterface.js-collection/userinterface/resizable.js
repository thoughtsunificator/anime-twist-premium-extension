UserInterface.model({
	name: "collection.resizable",
	method: UserInterface.appendChild,
	properties: {
		tagName: "div",
		className: "resizable"
	}
})

/**
 * @param  {Element} element
 * @param  {Object}  application
 * @param  {Array}   directions Can be horizontal, diagonal, vertical or all three.
 * @param  {boolean} preview    If true, will show a selection rectangle that moves indicating the new size of the target
 */
UserInterface.bind("collection.resizable", async function(element, application, directions, preview = true) {

	const resizable = {
		resizing: false,
		direction: null,
		x: null,
		y: null,
		size: null
	}

	UserInterface.listen(application, "resizable end", async (data) => {
		resizable.resizing = false
		resizable.x = data.x
		resizable.y = data.y
		UserInterface.announce(application, "resizable set size", resizable.size)
		element.parentNode.style.userSelect = ""
	})

	UserInterface.listen(application, "resizable start", async (data) => {
		resizable.resizing = true
		resizable.x = data.x
		resizable.y = data.y
		resizable.direction = data.direction
		element.parentNode.style.userSelect = "none"
	})

	document.addEventListener("mouseup", (event) => {
		if(resizable.resizing === true) {
			UserInterface.announce(application, "resizable end", { x: event.clientX, y: event.clientY})
		}
	})

	document.addEventListener("mousemove", function(event) {
		if(resizable.resizing === true) {
			const rect = element.getBoundingClientRect()
			const diffX = event.clientX - resizable.x
			const diffY = event.clientY - resizable.y
			let width = rect.width
			let height = rect.height
			if(resizable.direction === "vertical") {
				height = rect.height + (diffY)
			} else if(resizable.direction === "horizontal") {
				width = rect.width + (diffX)
			} else if(resizable.direction === "diagonal") {
				width = rect.width + (diffX)
				height = rect.height + (diffY)
			}
			resizable.size = { width, height}
			if(resizable.resizing === true) {
				UserInterface.announce(application, "resizable update", { width, height })
			}
		}
	})

	if(preview) {
		await UserInterface.runModel("collection.resizable.preview", {bindingArgs: [application, resizable], parentNode: element.parentNode})
	}


	for(const direction of directions) {
		await UserInterface.runModel("collection.resizable.indicator", {bindingArgs: [application, direction], parentNode: element.parentNode})
	}

})