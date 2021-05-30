ATP.WatchList = function() {
	this.entry = null
	this.entries = []
	this.initialized = false
}

/**
 * @param  {LocalStorage} localStorage
 */
ATP.WatchList.prototype.initialize = function(localStorage) {
	ATP.log("Initializing watchlist", localStorage.getItem("atp_entries"))
	let entriesData = []
	if(localStorage.getItem("atp_entries") !== null) {
		entriesData = JSON.parse(localStorage.getItem("atp_entries"))
	}
	entriesData.forEach(data => this.addEntry(data))
	this.initialized = true
}

/**
 * @param  {Object} data
 * @param  {string} data.title
 * @param  {string} data.slug
 * @return {WatchListEntry}
 */
ATP.WatchList.prototype.addEntry = function(data) {
	// ATP.log("Adding entry to watchlist", data)
	const entry = new ATP.WatchListEntry(data.title, data.slug, data.state)
	this.entries.push(entry)
	if(this.initialized) {
		localStorage.setItem("atp_entries", JSON.stringify(this.entries))
	}
	return entry
}

/**
 * @param  {WatchListEntry} entry
 */
ATP.WatchList.prototype.removeEntry = function(entry) {
	// ATP.log("Removing entry from watchlist", entry)
	this.entries = this.entries.filter(entry_ => entry_ !== entry)
	localStorage.setItem("atp_entries", JSON.stringify(this.entries))
}

/**
 * @param  {WatchListEntry} entry
 * @param  {object} data
 */
ATP.WatchList.prototype.updateEntry = function(entry, data) {
	// ATP.log("Updating watchlist entry", entry, data)
	for(const key in data) {
		entry[key] = data[key]
	}
	localStorage.setItem("atp_entries", JSON.stringify(this.entries))
}

/**
 * @param  {string} input
 * @return {string}
 */
ATP.WatchList.prototype.searchEntries = function(input) {
	const lowerCaseInput = input.toLowerCase()
	return this.entries.filter(entry => {
		return entry.title.toLowerCase().includes(lowerCaseInput)
			|| new Intl.DateTimeFormat("en-US").format(entry.date).includes(lowerCaseInput)
	})
}

ATP.WatchList.prototype.clearEntries = function() {
	ATP.log("Clearing watchlist entries", this.entries.length)
	this.entry = null
	this.entries = []
	localStorage.setItem("atp_entries", JSON.stringify(this.entries))
}