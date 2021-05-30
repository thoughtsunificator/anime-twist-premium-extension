UserInterface.model({
	name: "search.random",
	method: UserInterface.insertBefore,
	properties: {
		tagName: "button",
		id: "atp-search-random",
		textContent: "🎲"
	}
})

UserInterface.bind("search.random", async (element, atp, search) => {

	element.addEventListener("click", () => {
		const entry = search.getRandomEntry(atp.watchList.entries)
		UserInterface.announce(atp, "popup confirm open", { eventYes: "search entry navigate", data: entry, text: entry.title })
	})

})
