/**
 * @param {string} title
 * @param {string} slug
 */
ATP.SearchEntry = function(title, slug) {
	this.title = title
	this.slug = slug
	this.url = ATP.buildAnimeURL(slug)
}
