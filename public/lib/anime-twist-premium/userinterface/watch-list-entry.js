UserInterface.model({
	name: "watchlist.entry",
	method: UserInterface.appendChild,
	callback: data => ({
		tagName: "div",
		className: "atp-watch-list-entry",
		children: [
			{
				tagName: "button",
				className: "state",
				style: "font-size: 0.8rem",
				title: "Edit state",
				textContent: "✏️"
			},
			{
				title: data.date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
				tagName: "a",
				href: data.url,
				className: "name",
				textContent: data.title
			},
			{
				tagName: "div",
				className: "controls",
				children: [
					...ATP.SEARCH_ENGINE_LIST.map(engine => ({
						tagName: "a",
						target: "_blank",
						title: `Lookup ${data.title} on ${engine.name}`,
						href: engine.buildURL(data),
						children: [
							{
								tagName: "img",
								alt: engine.name,
								src: engine.icon,
								width: 24
							}
						]
					})),
					{
						tagName: "button",
						title: "Remove this entry",
						className: "remove",
						style: "font-size: 0.8rem; cursor: pointer;",
						textContent: "🗑️"
					}
				]
			}
		]
	})
})

UserInterface.bind("watchlist.entry", (element, atp, watchList, entry) => {

	const _listeners = []

	_listeners.push(UserInterface.listen(atp, "popup close", async () => {
		_listeners.forEach(listener => UserInterface.removeListener(listener))
	}))

	_listeners.push(UserInterface.listen(entry, "remove", async () => {
		_listeners.forEach(listener => UserInterface.removeListener(listener))
		element.remove()
	}))

	element.querySelector(".state").addEventListener("click" , event => {
		const controls = [
			{
				text: "Watching",
				action: "watchlist entry state update",
				model: "collection.button",
				value: {
					entry,
					state: ATP.WatchListEntry.STATE_WATCHING
				}
			},
			{
				text: "Completed",
				action: "watchlist entry state update",
				model: "collection.button",
				value: {
					entry,
					state: ATP.WatchListEntry.STATE_COMPLETED
				}
			},
			{
				text: "Plan to Watch",
				action: "watchlist entry state update",
				model: "collection.button",
				value: {
					entry,
					state: ATP.WatchListEntry.STATE_PLAN_TO_WATCH
				}
			},
			{
				text: "Dropped",
				action: "watchlist entry state update",
				model: "collection.button",
				value: {
					entry,
					state: ATP.WatchListEntry.STATE_DROPPED
				}
			}
		].filter(control => control.value.state !== entry.state)
		UserInterface.announce(atp, "popup controls open", controls)
	})

	element.querySelector(".remove").addEventListener("click" , () => {
		UserInterface.announce(atp, "popup confirm open", { eventYes: "watchlist entry remove", eventNo: "watchlist lists popup", data: { entry, popup: true }, text: "Are you sure?" })
	})

})