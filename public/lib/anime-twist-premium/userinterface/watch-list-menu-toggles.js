UserInterface.model({
	name: "watchlist.menu-toggles",
	method: UserInterface.appendChild,
	properties: {
		tagName: "button",
		textContent: "📺"
	}
})

UserInterface.bind("watchlist.menu-toggles", async (element, atp, watchList) => {

	element.addEventListener("click", () => {
		UserInterface.announce(watchList, "lists popup")
	})

})