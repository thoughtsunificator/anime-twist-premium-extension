/**
 * @param {string} title
 * @param {string} slug
 */
ATP.WatchListEntry = function(title, slug, state = ATP.WatchListEntry.STATE_WATCHING) {
	this.title = title
	this.slug = slug
	this.date = new Date()
	this.state = state
	this.url = ATP.buildAnimeURL(slug)
}

ATP.WatchListEntry.STATE_COMPLETED = "STATE_COMPLETED"
ATP.WatchListEntry.STATE_WATCHING = "STATE_WATCHING"
ATP.WatchListEntry.STATE_PLAN_TO_WATCH = "STATE_PLAN_TO_WATCH"
ATP.WatchListEntry.STATE_DROPPED = "STATE_DROPPED"