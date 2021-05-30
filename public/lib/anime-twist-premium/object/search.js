ATP.Search = function() {
	this.initialized = false
	this.entries = []
}

ATP.Search.prototype.initialize = function(localStorage) {
	ATP.log("Initializing search", localStorage.getItem("atp_search_entries"))
	let entriesData = []
	if(localStorage.getItem("atp_search_entries") !== null) {
		entriesData = JSON.parse(localStorage.getItem("atp_search_entries"))
	}
	entriesData.forEach(data => this.addEntry(data))
	this.initialized = true
}

/**
 * @param  {Object} data
 * @param  {string} data.title
 * @param  {string} data.slug
 * @return {SearchEntry}
 */
ATP.Search.prototype.addEntry = function(data) {
	// ATP.log("Adding a new search entry...", data)
	const entry = new ATP.SearchEntry(data.title, data.slug)
	this.entries.push(entry)
	if(this.initialized) {
		localStorage.setItem("atp_search_entries", JSON.stringify(this.entries))
	}
	return entry
}

ATP.Search.prototype.getRandomEntry = function(watchListEntries) {
	console.log(this.entries)
	const entries = this.entries.filter(entry => !watchListEntries.find(entry_ => entry_.slug === entry.slug))
	console.log(entries)
	return entries[Math.floor(Math.random() * entries.length)]
}
