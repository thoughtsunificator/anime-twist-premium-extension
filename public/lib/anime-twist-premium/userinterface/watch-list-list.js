UserInterface.model({
	name: "watchlist.list",
	method: UserInterface.appendChild,
	callback: data => ({
		tagName: "div",
		className: `list ${data.className}`,
		children: [
			{
				tagName: "h2",
				className: "title",
				title: "Toggle list",
				textContent: data.title
			},
			{
				tagName: "div",
				className: "entries",
			},
			{
				tagName: "p",
				className: "no-result",
				textContent: "There's nothing here."
			}
		]
	})
})

UserInterface.bind("watchlist.list", async (element, atp, watchList, entryState) => {

	const entriesNode = element.querySelector(".entries")
	const _listeners = []

	_listeners.push(UserInterface.listen(atp, "popup close", async () => {
		_listeners.forEach(listener => UserInterface.removeListener(listener))
		UserInterface.announce(atp, "paginator destroy")
	}))

	_listeners.push(UserInterface.listen(watchList, "lists render", async (input) => {
		// ATP.log("Rendering watchlist list...", entryState)

		await UserInterface.announce(atp, "paginator destroy")

		let entries
		if(input) {
			entries = watchList.searchEntries(input).filter(entry => entry.state === entryState)
		} else {
			entries = watchList.entries.filter(entry => entry.state === entryState)
		}

		entries = entries.slice()

		entries.sort((a, b) => {
			if (a.title.toLowerCase() > b.title.toLowerCase()) {
				return 1
			}
			if (a.title.toLowerCase() < b.title.toLowerCase()) {
				return -1
			}
			return 0
		})

		if(entries.length >= 1) {
			UserInterface.runModel("paginator", {
				parentNode: entriesNode,
				bindingArgs: [atp, "watchlist.entry", [atp, watchList], 5, entries]
			})
		}

	}))

	_listeners.push(UserInterface.listen(watchList, "entry updated", async data => {
		if(data.data.state === entryState) {
			UserInterface.runModel("watchlist.entry", { data: data.entry, parentNode: entriesNode, bindingArgs: [atp, watchList, data.entry] })
		}
	}))

	_listeners.push(UserInterface.listen(watchList, "entries updated", async () => UserInterface.announce(watchList, "lists render")))

	element.querySelector(".title").addEventListener("click", () => {
		element.classList.toggle("hidden")
	})

})



