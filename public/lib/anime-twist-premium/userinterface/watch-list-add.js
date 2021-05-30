UserInterface.model({
	name: "watchlist.add",
	method: UserInterface.insertBefore,
	properties: {
		tagName: "button",
		style: "display: none",
		textContent: "➕",
		title: "Add to Watchlist"
	}
})

UserInterface.bind("watchlist.add", (element, atp, watchList) => {

	const _listeners = []

	if(watchList.entry !== null) {
		element.textContent = "🗑️"
	}

	if(ATP.isAnimePage(location.pathname)) {
		element.style.display = "block"
	}

	_listeners.push(UserInterface.listen(atp, "pathname update", async data => {
		if(ATP.isAnimePage(data.current) === false) {
			_listeners.forEach(listener => UserInterface.removeListener(listener))
		}
	}))

	_listeners.push(UserInterface.listen(watchList, "entry added", async entry => {
		if(entry === watchList.entry) {
			element.textContent = "🗑️"
			element.title = "Remove from Watchlist"
		} else {
			element.textContent = "➕"
			element.title = "Add to Watchlist"
		}
	}))

	_listeners.push(UserInterface.listen(watchList, "entry removed", async () => {
		if(watchList.entry === null) {
			element.textContent = "➕"
			element.title = "Add to Watchlist"
		} else {
			element.textContent = "🗑️"
			element.title = "Remove from Watchlist"
		}
	}))

	_listeners.push(UserInterface.listen(watchList, "entries clear", async () => {
		element.textContent = "➕"
		element.title = "Add to Watchlist"
	}))

	_listeners.push(UserInterface.listen(watchList, "entries updated", async () => {
		if(watchList.entry === null) {
			element.textContent = "➕"
			element.title = "Add to Watchlist"
		} else {
			element.textContent = "🗑️"
			element.title = "Remove from Watchlist"
		}
	}))

	element.addEventListener("click", () => {
		if(watchList.entry === null) {
			const entry = {
					title: document.querySelector(".series-title").textContent.trim(),
					slug: ATP.getSlug(location.pathname)
			}
			UserInterface.announce(atp, "popup controls open", [
				{
					text: "Watching",
					action: "watchlist entry add",
					model: "collection.button",
					value: {
						...entry,
						state: ATP.WatchListEntry.STATE_WATCHING
					}
				},
				{
					text: "Completed",
					action: "watchlist entry add",
					model: "collection.button",
					value: {
						...entry,
						state: ATP.WatchListEntry.STATE_COMPLETED
					}
				},
				{
					text: "Plan to Watch",
					action: "watchlist entry add",
					model: "collection.button",
					value: {
						...entry,
						state: ATP.WatchListEntry.STATE_PLAN_TO_WATCH
					}
				},
				{
					text: "Dropped",
					action: "watchlist entry add",
					model: "collection.button",
					value: {
						...entry,
						state: ATP.WatchListEntry.STATE_DROPPED
					}
				}
			])
			// UserInterface.announce(watchList, "entry add", {
			// 	title: document.querySelector(".series-title").textContent.trim(),
			// 	slug: ATP.getSlug(location.pathname),
			// 	state: ATP.WatchListEntry.STATE_WATCHING
			// })
		} else {
			UserInterface.announce(atp, "popup confirm open", { eventYes: "watchlist entry remove", data: { entry: watchList.entry }, text: "Are you sure?" })
		}
	})

})
