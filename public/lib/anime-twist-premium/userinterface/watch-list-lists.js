UserInterface.model({
	name: "watchlist.lists",
	method: UserInterface.appendChild,
	properties: {
		tagName: "div",
		id: "atp-watch-lists",
		children: [
			{
				tagName: "div",
				style: "display: grid; grid-template-columns: 1fr auto",
				children: [
					{
						tagName: "h2",
						textContent: "Anime Twist Premium"
					},
					{
						tagName: "button",
						className: "close",
						textContent: "×"
					}
				]
			},
			{
				tagName: "div",
				style: "overflow: auto; max-height: 90vh; padding-right: 10px;",
				children: [
					{
						tagName: "input",
						placeholder: "Search for an anime...",
						className: "search"
					},
					{
						tagName: "div",
						className: "lists"
					},
					{
						tagName: "footer",
						children: [
							{
								tagName: "button",
								className: "export",
								textContent: "Export"
							},
							{
								tagName: "button",
								className: "clear",
								textContent: "Clear"
							},
							{
								tagName: "button",
								className: "import",
								textContent: "Import"
							},
						]
					}
				]
			}
		]
	}
})

UserInterface.bind("watchlist.lists", async (element, atp, watchList) => {

	await UserInterface.runModel("watchlist.list", {
		parentNode: document.querySelector(".lists"),
		data: { className: "watching", title: "Watching" },
		bindingArgs: [atp, watchList, ATP.WatchListEntry.STATE_WATCHING]
	})
	await UserInterface.runModel("watchlist.list", {
		parentNode: document.querySelector(".lists"),
		data: { className: "completed", title: "Completed" },
		bindingArgs: [atp, watchList, ATP.WatchListEntry.STATE_COMPLETED]
	})
	await UserInterface.runModel("watchlist.list", {
		parentNode: document.querySelector(".lists"),
		data: { className: "plan-to-watch", title: "Plan to Watch" },
		bindingArgs: [atp, watchList, ATP.WatchListEntry.STATE_PLAN_TO_WATCH]
	})
	await UserInterface.runModel("watchlist.list", {
		parentNode: document.querySelector(".lists"),
		data: { className: "dropped", title: "Dropped" },
		bindingArgs: [atp, watchList, ATP.WatchListEntry.STATE_DROPPED]
	})

	element.querySelector(".clear").addEventListener("click" , () => {
		UserInterface.announce(atp, "popup confirm open", { eventYes: "watchlist entries clear", eventNo: "watchlist lists popup", text: "Are you sure?" })
	})

	element.querySelector(".export").addEventListener("click" , () => {
		UserInterface.announce(watchList, "export")
	})

	element.querySelector(".import").addEventListener("click" , () => {
		UserInterface.announce(watchList, "import popup")
	})

	element.querySelector(".close").addEventListener("click" , () => {
		UserInterface.announce(atp, "popup close")
	})

	element.querySelector(".search").addEventListener("input" , async () => {
		await UserInterface.announce(watchList, "lists render", event.target.value)
	})

	UserInterface.announce(watchList, "lists render")

})



