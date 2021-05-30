UserInterface.model({
	name: "collection.popup_form",
	method: UserInterface.appendChild,
	properties: {
		tagName: "form",
		id: "popup-form",
		children: [
			{
				tagName: "div",
				className: "body"
			},
			{
				tagName: "div",
				className: "popup-footer",
				children: [
					{
						tagName: "button",
						type: "reset",
						textContent: "Reset"
					},
					{
						tagName: "button",
						textContent: "Confirm"
					}
				]
			}
		]
	}
})

UserInterface.bind("collection.popup_form", async function(element, application, model, action, data, form = {}) {

	await UserInterface.runModel(model, { parentNode: element.querySelector(".body") })

	const _form = {}

	const identifier = {}

	const controlElements = [...element.querySelectorAll("[class^=identifier-]")]

	for(const controlElement of controlElements) {
		identifier[controlElement.className.slice("identifier-".length)] = controlElement
	}

	const keys = Object.keys(identifier)

	element.addEventListener("submit", () => {
		event.preventDefault()
		for(const key of keys) {
			if(identifier[key].tagName === "INPUT" && identifier[key].type === "radio") {
				_form[key] = element.querySelector(`input[name=${identifier[key].name}]:checked`).value
			} else {
				_form[key] = identifier[key].value
			}
		}
		UserInterface.announce(application, "popup close")
		UserInterface.announce(application, action, { data, form: _form })
	})

	for(const key in form) {
		if(key in identifier) {
			if(identifier[key].tagName === "INPUT" && identifier[key].type === "radio") {
				[...element.querySelectorAll(`input[name=${identifier[key].name}]`)].find(element => element.value == form[key]).checked = true
			} else if(identifier[key].tagName === "SELECT") {
				for(const option of identifier[key].options) {
					if(option.value === form[key]) {
						option.setAttribute("selected", "")
						break
					}
				}
			} else if(identifier[key].tagName === "TEXTAREA") {
				identifier[key].textContent = form[key]
			} else {
				identifier[key].setAttribute("value", form[key])
			}
		}
	}

	identifier[Object.keys(identifier)[0]].focus()

})
