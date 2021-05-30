UserInterface.model({
	name: "player",
	method: UserInterface.appendChild,
	properties: {
		tagName: "div",
	}
})

UserInterface.bind("player", (element, atp) => {

	UserInterface.listen(atp, "page rendered", async () => {
		ATP.log("Rendering player...")
		if(ATP.isAnimePage(location.pathname)) {
			UserInterface.runModel("player.download", {
				parentNode: document.querySelector(".video-data"),
				bindingArgs: [atp]
			})
		}
	})

})
