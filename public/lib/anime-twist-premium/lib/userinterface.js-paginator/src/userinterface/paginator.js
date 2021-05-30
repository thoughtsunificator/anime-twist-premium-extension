UserInterface.model({
	name: "paginator",
	method: UserInterface.appendChild,
	properties: {
		tagName: "div",
		id: "paginator",
		children: [
			{
				tagName: "div",
				className: "pagination-content"
			},
			{
				tagName: "div",
				className: "pagination-pages",
				children: [
					{
						tagName: "button",
						className: "pagination-previous",
						textContent: "←",
						disabled: true,
					},
					{
						tagName: "div",
						className: "pagination-indicators",
					},
					{
						tagName: "button",
						className: "pagination-next",
						textContent: "→",
					},
					{
						tagName: "input",
						type: "number",
						min: 1,
						className: "pagination-jump",
					}
				]
			}
		]
	}
})

UserInterface.bind("paginator", async function(element, application, model, bindingArgs, perPage, items) {

	const paginator = new Paginator(perPage, items)

	const _listeners = []

	const _contentNode = element.querySelector(".pagination-content")
	const _pagesNode = element.querySelector(".pagination-indicators")
	const _previousNode = element.querySelector(".pagination-previous")
	const _nextNode = element.querySelector(".pagination-next")
	const _jumpNode = element.querySelector(".pagination-jump")

	_listeners.push(UserInterface.listen(application, "paginator destroy", async () => {
		_listeners.forEach(listener => UserInterface.removeListener(listener))
		for(const page of paginator.pages) {
			UserInterface.announce(page, "remove")
		}
		for(const item of items) {
			UserInterface.announce(item, "remove")
		}
		element.remove()
	}))

	_listeners.push(UserInterface.listen(paginator, "navigate", async page => {
		if(paginator.page !== null) {
			UserInterface.announce(paginator.page, "unselect")
		}
		paginator.page = page
		if(paginator.page.index === 0) {
			_previousNode.disabled = true
		} else if(paginator.pages.length > 1) {
			_previousNode.disabled = false
		}
		if(paginator.page.index === paginator.pages.length - 1) {
			_nextNode.disabled = true
		} else if(paginator.pages.length > 1) {
			_nextNode.disabled = false
		}
		_jumpNode.value = page.index + 1
		for(const item of items) {
			UserInterface.announce(item, "remove")
		}
		for(const item of page.items) {
			await UserInterface.runModel(model, { parentNode:  _contentNode, data: item, bindingArgs: [...bindingArgs, item] })
		}
		UserInterface.announce(paginator.page, "select")
	}))

	_listeners.push(UserInterface.listen(paginator, "previous", async () => {
		if(paginator.page.index === 0) {
			return
		}
		UserInterface.announce(paginator, "navigate", paginator.pages[paginator.page.index - 1])
	}))

	_listeners.push(UserInterface.listen(paginator, "next", async () => {
		if(paginator.page.index === paginator.pages.length - 1) {
			return
		}
		UserInterface.announce(paginator, "navigate", paginator.pages[paginator.page.index + 1])
	}))

	_previousNode.addEventListener("click", () => UserInterface.announce(paginator, "previous"))
	_nextNode.addEventListener("click", () => UserInterface.announce(paginator, "next"))
	_jumpNode.addEventListener("input", event => {
		if(event.target.value >= 1 && event.target.value <= paginator.pages.length) {
			UserInterface.announce(paginator, "navigate", paginator.pages[event.target.value - 1])
		}
	})

	paginator.initialize()

	if(paginator.pages.length > 1) {
		_nextNode.disabled = false
	}

	if(paginator.pages.length === 1) {
		_jumpNode.disabled = true
	} else {
		_jumpNode.max = paginator.pages.length
	}

	for(const page of paginator.pages) {
		await UserInterface.runModel("paginator.page", { parentNode:  _pagesNode, data: page, bindingArgs: [application, paginator, page] })
	}

	if(paginator.pages.length >= 1) {
		_previousNode.style.display = "block"
		_nextNode.style.display = "block"
		_jumpNode.style.display = "block"
		UserInterface.announce(paginator, "navigate", paginator.pages[0])
	}

})

