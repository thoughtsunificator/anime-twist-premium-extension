UserInterface.model({
	name: "watchlist",
	method: UserInterface.appendChild,
	properties: {
		tagName: "div",
		id: "atp-watchlist"
	}
})

UserInterface.bind("watchlist", async (element, atp) => {

	const watchList = new ATP.WatchList()
	atp.watchList = watchList

	let _menuRendered = false

	watchList.initialize(localStorage)

	UserInterface.listen(atp, "page rendered", async () => {
		ATP.log("Rendering watchlist...")
		const entry = watchList.entries.find(entry => entry.slug === ATP.getSlug(location.pathname))
		if(entry) {
			watchList.entry = entry
		} else {
			watchList.entry = null
		}
		if(_menuRendered === false) {
			ATP.log("Rendering watchlist menu...")
			_menuRendered = true
			await UserInterface.runModel("watchlist.menu", {
				parentNode: document.querySelector(".toggle-settings"),
				bindingArgs: [atp, watchList]
			})
		}
		if(ATP.isAnimePage(location.pathname)) {
			ATP.log("Rendering watchlist add...")
			await UserInterface.runModel("watchlist.add", {
				parentNode: document.querySelector(".video-data"),
				bindingArgs: [atp, watchList]
			})
		}
	})

	UserInterface.listen(atp, "watchlist lists popup", async () => {
		UserInterface.announce(watchList, "lists popup")
	})

	UserInterface.listen(atp, "watchlist entry remove", async data => {
		await UserInterface.announce(watchList, "entry remove", data.entry)
		if(data.popup) {
			UserInterface.announce(watchList, "lists popup")
		}
	})

	UserInterface.listen(atp, "watchlist entries clear", async () => {
		await UserInterface.announce(watchList, "entries clear")
		UserInterface.announce(watchList, "lists popup")
	})

	UserInterface.listen(atp, "watchlist entry add", async data => {
		UserInterface.announce(watchList, "entry add", data)
		UserInterface.announce(atp, "popup close")
	})

	UserInterface.listen(atp, "watchlist entry state update", async data => {
		await UserInterface.announce(watchList, "entry update", { entry: data.entry,  data: { state: data.state  } })
		UserInterface.announce(watchList, "lists popup")
	})

	UserInterface.listen(watchList, "lists popup", async () => {
		UserInterface.announce(atp, "popup open", {
			model: "watchlist.lists",
			bindingArgs: [atp, watchList]
		})
	})

	UserInterface.listen(watchList, "entry add", async data => {
		const entry = watchList.addEntry(data)
		watchList.entry = entry
		UserInterface.announce(watchList, "entry added", entry)
	})

	UserInterface.listen(watchList, "entry remove", async entry => {
		watchList.removeEntry(entry)
		if(watchList.entry === entry) {
			watchList.entry = null
		}
		await UserInterface.announce(entry, "remove")
		UserInterface.announce(watchList, "entry removed", entry)
	})

	UserInterface.listen(watchList, "entry update", async data => {
		watchList.updateEntry(data.entry, data.data)
		UserInterface.announce(watchList, "entry updated", data)
	})

	UserInterface.listen(watchList, "entries clear", async () => {
		const length = watchList.entries.length
		for(let i = 0; i < length; i++) {
			await UserInterface.announce(watchList, "entry remove", watchList.entries[0])
		}
	})

	UserInterface.listen(watchList, "entries load", async entries => {
		const entries_ = entries.filter(entry => !watchList.entries.find(entry_ => entry.slug === entry_.slug))
		if(watchList.entry === null && ATP.isAnimePage(location.pathname)) {
			const entry = entries_.find(entry => entry.slug === ATP.getSlug(location.pathname))
			if(entry) {
				watchList.entry = entry
			}
		}
		for(const entry of entries_) {
			watchList.addEntry(entry)
		}
		UserInterface.announce(watchList, "entries updated")
	})

	UserInterface.listen(watchList, "export", async () => {
		const blob = new Blob([JSON.stringify(watchList.entries)], { type : "application/json" })
		const reader = new FileReader()
		const anchorElement = document.createElement("a")
		const date = new Date()
		anchorElement.download = `atp-${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.json`
		reader.onload = function(event) {
			anchorElement.href = event.target.result
			anchorElement.click()
		}
		reader.onerror = event => ATP.log(event)
		reader.readAsDataURL(blob)
	})

	UserInterface.listen(atp, "watchlist import", async data => {
		UserInterface.announce(watchList, "lists popup")
		const inputElement = document.createElement("input")
		inputElement.type = "file"
		inputElement.addEventListener("change", event => {
			const reader = new FileReader();
			reader.onload = function(event_) {
				let entries
				if(data === "atp") {
					entries = JSON.parse(event_.target.result)
				} else if(data === "myanimelist") {
					const domParser = new DOMParser();
					const doc = domParser.parseFromString(event_.target.result, "application/xml")
					entries = []
					const animeNodes = doc.querySelectorAll("anime")
					for(const animeNode of animeNodes) {
						const myStatus = animeNode.querySelector("my_status").textContent
						let state = ATP.WatchListEntry.STATE_PLAN_TO_WATCH
						if(myStatus === "Watching") {
							state = ATP.WatchListEntry.STATE_WATCHING
						} else if(myStatus === "Completed") {
							state = ATP.WatchListEntry.STATE_COMPLETED
						} else if(myStatus === "Plan to Watch") {
							state = ATP.WatchListEntry.STATE_PLAN_TO_WATCH
						} else if(myStatus === "Dropped") {
							state = ATP.WatchListEntry.STATE_DROPPED
						}
						const myStartDate = animeNode.querySelector("my_start_date").textContent
						let date = new Date()
						if(isNaN(Date.parse(myStartDate)) === false) {
							date = new Date(myStartDate)
						}
						const searchEntry = atp.search.entries.find(entry => entry.title === animeNode.querySelector("series_title").textContent)
						if(searchEntry) {
							entries.push({
								slug: searchEntry.slug,
								title: searchEntry.title,
								state,
								date
							})
						}
					}
				}
				UserInterface.announce(watchList, "entries load", entries)
			}
			reader.onerror = event => ATP.log(event)
			reader.readAsText(event.target.files[0])
		})
		inputElement.click()
	})

	UserInterface.listen(watchList, "import popup", async () => {
		UserInterface.announce(atp, "popup controls open", [
			{
				text: "ATP",
				action: "watchlist import",
				model: "collection.button",
				value: "atp"
			},
			{
				text: "MyAnimeList",
				action: "watchlist import",
				model: "collection.button",
				value: "myanimelist"
			}
		])
	})

})
