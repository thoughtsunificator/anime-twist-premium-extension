UserInterface.model({
	name: "search",
	method: UserInterface.appendChild,
	properties: {
		tagName: "div",
		id: "atp-search"
	}
})

UserInterface.bind("search", async (element, atp) => {

	const search = new ATP.Search()
	atp.search = search

	search.initialize(localStorage)

	let _seriesNodes = null
	const _observer = new MutationObserver(() => {
		UserInterface.announce(search, "entries render state")
	})

	UserInterface.listen(atp, "search entry navigate", async (entry) => {
		window.location.href = ATP.buildAnimeURL(entry.slug)
	})

	UserInterface.listen(atp.watchList, "search entry navigate", async (entry) => {
		window.location.href = ATP.buildAnimeURL(entry.slug)
	})


	UserInterface.listen(search, "entries render state", async () => {
		// ATP.log("Updating search entries...")
		if(_observer) {
			_observer.disconnect()
		}
		for(const seriesNode of _seriesNodes) {
			const titleNode = seriesNode.querySelector(".series-title")
			const slug = ATP.getSlug(titleNode.href)
			const entry = atp.watchList.entries.find(entry => entry.slug === slug)
			seriesNode.classList.remove("completed", "plan-to-watch", "watching", "dropped")
			if(entry && entry.slug === slug) {
				if(entry.state === ATP.WatchListEntry.STATE_COMPLETED) {
					seriesNode.classList.add("completed")
				} else if(entry.state === ATP.WatchListEntry.STATE_PLAN_TO_WATCH) {
					seriesNode.classList.add("plan-to-watch")
				} else if(entry.state === ATP.WatchListEntry.STATE_WATCHING) {
					seriesNode.classList.add("watching")
				} else if(entry.state === ATP.WatchListEntry.STATE_DROPPED) {
					seriesNode.classList.add("dropped")
				}
			}
		}
		_observer.observe(document.querySelector(".series ul"), { childList: true, subtree: true, attributes: true })
	})

	UserInterface.listen(atp.watchList, "entries updated", async () => {
		if(_seriesNodes !== null) {
			UserInterface.announce(search, "entries render state")
		}
	})

	UserInterface.listen(atp.watchList, "entry added", async () => {
		if(_seriesNodes !== null) {
			UserInterface.announce(search, "entries render state")
		}
	})

	UserInterface.listen(atp.watchList, "entry removed", async () => {
		if(_seriesNodes !== null) {
			UserInterface.announce(search, "entries render state")
		}
	})

	UserInterface.listen(atp.watchList, "entry updated", async () => {
		if(_seriesNodes !== null) {
			UserInterface.announce(search, "entries render state")
		}
	})

	UserInterface.listen(atp, "page rendered", async () => {
		ATP.log("Rendering search...")

		if(_observer) {
			_observer.disconnect()
		}

		if(ATP.isAnimePage(location.pathname) === false) {
			const seriesNode = document.querySelector(".series")
			_seriesNodes = [...document.querySelectorAll(".series li")]

			for(const seriesNode of _seriesNodes) {
				const titleNode = seriesNode.querySelector(".series-title")
				const slug = ATP.getSlug(titleNode.href)
				if(!search.entries.find(entry => entry.slug === slug)) {
					search.addEntry({
						title: titleNode.textContent.trim(),
						slug
					})
				}
			}

			UserInterface.announce(search, "entries render state")

			seriesNode.parentNode.classList.add("atp-search")

			await UserInterface.runModel("search.random", {
				parentNode: seriesNode,
				bindingArgs: [atp, search]
			})

			_observer.observe(document.querySelector(".series ul"), { childList: true, subtree: true, attributes: true })
		} else {
			_seriesNodes = null
		}
	})

})
