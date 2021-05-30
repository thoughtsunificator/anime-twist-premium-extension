ATP = function() {
	this.state = ATP.STATE_IDLE
}

ATP.DEBUG = false
ATP.LOGS_MAXIMUM_ENTRIES = 15

ATP.log = function() {
	if(ATP.DEBUG) {
		console.log("[atp]", ...arguments)
	}
	ATP.addLog(...arguments)
}


ATP.addLog = function() {
	const logItem = localStorage.getItem("atp_logs")
	let logs = []
	if(logItem !== null) {
		logs = JSON.parse(logItem)
	}

	if(logs.length === ATP.LOGS_MAXIMUM_ENTRIES) {
		logs.pop()
	}

	logs.push({
		type: "logs",
		arguments,
		date: new Date()
	})

	localStorage.setItem("atp_logs", JSON.stringify(logs))
}

/**
 * @param  {string} slug
 * @return {string}
 */
ATP.buildAnimeURL = slug => {
	return location.origin + "/a/" + slug + "/first"
}

/**
 * @param  {string} pathname
 * @return {string}
 */
ATP.getSlug = pathname => {
	if(pathname.includes("/a/")) {
		return pathname.split("/a/")[1].split("/")[0]
	}
}

/**
 * @param  {string} pathname
 * @return {string}
 */
ATP.isAnimePage = pathname => {
	return pathname.startsWith("/a/")
}

ATP.STATE_IDLE = "STATE_IDLE"
ATP.STATE_RENDERING = "STATE_RENDERING"
ATP.STATE_RENDERED = "STATE_RENDERED"