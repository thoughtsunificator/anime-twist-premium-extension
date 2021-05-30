UserInterface.model({
	name: "collection.popup_controls",
	method: UserInterface.appendChild,
	properties: {
		tagName: "div",
		id: "popup-controls"
	}
})


UserInterface.bind("collection.popup_controls", async function(element, application, controls) {

	for(const control of controls) {
		await UserInterface.runModel(control.model, { data: control, parentNode: element, bindingArgs: [application, control] })
	}

})
