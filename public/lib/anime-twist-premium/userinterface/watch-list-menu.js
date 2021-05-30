UserInterface.model({
	name: "watchlist.menu",
	method: UserInterface.insertBefore,
	properties: {
		tagName: "div",
		className: "atp-watchlist-menu",
		children: [
			{
				tagName: "button",
				className: "watchlist",
				title: "Your watchlist (by Anime Twist Premium)",
				textContent: "📺"
			}
		]
	}
})

UserInterface.bind("watchlist.menu", async (element, atp, watchList) => {

	const _watchListButton = element.querySelector(".watchlist")

	UserInterface.runModel("watchlist.menu-toggles", { parentNode: document.querySelector(".toggles"), bindingArgs: [atp, watchList] })

	_watchListButton.addEventListener("click", () => {
		UserInterface.announce(watchList, "lists popup")
	})

})