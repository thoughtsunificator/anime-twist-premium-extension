UserInterface.model({
	name: "collection.tab",
	method: UserInterface.appendChild,
	callback: data => ({
		tagName: "div",
		...(data && data.text && { textContent: data.text }),
		...(data && data.className && { className: data.className })
	})
})

/**
 * @param  {Element} element
 * @param  {Object}  application
 * @param  {Object}  control
 * @param  {string}  control.action   The name of the event
 * @param  {*}       control.name  The name of the tab that will be passed to the event listeners
 * @param  {boolean} control.toggle   If true the event will be announced even if the tab is already selected.
 */
UserInterface.bind("collection.tab", async function(element, application, control) {

	let active = false

	UserInterface.listen(application, control.action, async function(name) {
		if(name === control.name) {
			active = true
			element.classList.add("active")
		} else {
			active = false
			element.classList.remove("active")
		}
	})

	element.addEventListener("click", function() {
		let tabName = null
		if(active === false || control.toggle !== true) {
			tabName = control.name
		}
		UserInterface.announce(application, control.action, tabName)
	})
})