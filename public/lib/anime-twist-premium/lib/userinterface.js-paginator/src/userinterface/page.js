UserInterface.model({
	name: "paginator.page",
	method: UserInterface.appendChild,
	callback: data => ({
		tagName: "button",
		className: "pagination-indicator",
		textContent: data.numero
	})
})

UserInterface.bind("paginator.page", async function(element, application, paginator, page) {

	const _listeners = []

	_listeners.push(UserInterface.listen(paginator, "navigate", async page_ => {
		// show two page behind backward page forward
		if(Math.abs(page.index - page_.index) <= Math.floor(Paginator.MAXIMUM_DISPLAYED_PAGES / 2)
			|| page_.index < Math.floor(Paginator.MAXIMUM_DISPLAYED_PAGES / 2) + 1 && page.index < Paginator.MAXIMUM_DISPLAYED_PAGES
			|| paginator.pages.length - page_.index < Math.floor(Paginator.MAXIMUM_DISPLAYED_PAGES / 2) + 1 && paginator.pages.length - page.index - 1 < Paginator.MAXIMUM_DISPLAYED_PAGES) {
			element.style.display = "block"
		} else {
			element.style.display = "none"
		}
	}))

	_listeners.push(UserInterface.listen(page, "select", async () => {
		element.disabled = true
	}))

	_listeners.push(UserInterface.listen(page, "unselect", async () => {
		element.disabled = false
	}))

	_listeners.push(UserInterface.listen(page, "remove", async () => {
		_listeners.forEach(listener => UserInterface.removeListener(listener))
		element.remove()
	}))

	element.addEventListener("click", () => UserInterface.announce(paginator, "navigate", page))
})
