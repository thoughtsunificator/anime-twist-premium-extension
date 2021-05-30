/**
 * @param  {number} perPage [description]
 * @param  {array} items    [description]
 */
function Paginator(perPage, items) {
	this.perPage = perPage
	this.items = items
	this.pages = []
	this.page = null
}

Paginator.prototype.initialize = function() {
	let page = new Paginator.Page(0, 1)
	for(let i = 0; i < this.items.length; i++) {
		page.items.push(this.items[i])
		if(i > 0 && page.items.length % this.perPage === 0 || i === this.items.length - 1) {
			this.pages.push(page)
			page = new Paginator.Page(page.index + 1, page.numero + 1)
		}
	}
}

Paginator.MAXIMUM_DISPLAYED_PAGES = 5