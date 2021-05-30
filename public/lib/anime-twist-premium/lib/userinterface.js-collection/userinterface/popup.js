UserInterface.model({
	name: "collection.popup",
	method: UserInterface.appendChild,
	properties: {
		tagName: "div",
		id: "popup",
		children: [
			{
				tagName: "div",
				className: "popup-body"
			}
		]
	}
})

UserInterface.bind("collection.popup", async function(element, application) {

	let _opened = false

	const popupBodyElement = element.querySelector(".popup-body")

	UserInterface.listen(application, "popup open", async data => {
		if(_opened === true) {
			UserInterface.announce(application, "popup close")
		}
		_opened = true
		element.style.display = "grid"
		UserInterface.runModel(data.model, { data: data.data, parentNode: popupBodyElement, bindingArgs: data.bindingArgs })
	})

	UserInterface.listen(application, "popup close", async () => {
		if(_opened === false) {
			return
		}
		_opened = false
		element.style.display = "none"
		popupBodyElement.children[0].remove()
	})

	UserInterface.listen(application, "popup form open", async data => {
		UserInterface.announce(application, "popup open", {
			model: "collection.popup_form",
			bindingArgs: [
				application,
				data.model,
				data.action,
				data.data,
				data.form
			]
		})
	})

	UserInterface.listen(application, "popup controls open", async data => {
		UserInterface.announce(application, "popup open", {
			model: "collection.popup_controls",
			bindingArgs: [
				application,
				data
			]
		})
	})

	UserInterface.listen(application, "popup confirm open", async data => {
		UserInterface.announce(application, "popup open", { data: data, model: "collection.popup_confirm", bindingArgs: [ application, data.data, data.eventYes, data.eventNo ] })
	})

	window.addEventListener("keyup", event => {
		if (event.keyCode === 27) {
			UserInterface.announce(application, "popup close")
		}
	})

	element.addEventListener("click", event => {
		if(event.target.contains(element) === true) {
			UserInterface.announce(application, "popup close")
		}
	})

})