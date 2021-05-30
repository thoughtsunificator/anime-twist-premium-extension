UserInterface.model({
	name: "collection.popup_confirm",
	method: UserInterface.appendChild,
	callback: data => ({
		tagName: "div",
		id: "popup-confirm",
		children: [
			{
				tagName: "div",
				textContent: data.text
			},
			{
				tagName: "div",
				className: "popup-footer",
				children: [
					{
						tagName: "button",
						className: "no",
						textContent: "No"
					},
					{
						tagName: "button",
						className: "yes",
						textContent: "Yes"
					}
				]
			}
		]
	})
})

UserInterface.bind("collection.popup_confirm", async function(element, application, data, eventYes, eventNo) {

	function confirm(answer) {
		UserInterface.announce(application, "popup close")
		if(answer) {
			UserInterface.announce(application, eventYes, data)
		} else if(eventNo) {
			UserInterface.announce(application, eventNo, data)
		}
	}

	element.querySelector(".no").addEventListener("click", () => confirm(false))
	element.querySelector(".yes").addEventListener("click", () => confirm(true))

	element.querySelector(".no").focus()

})