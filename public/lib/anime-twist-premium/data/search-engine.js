ATP.SEARCH_ENGINE_LIST = [
	{
		name: "anidb.net",
		buildURL: entry => `https://anidb.net/anime/?adb.search=${entry.title}&do.search=1`,
		icon: "https://cdn-eu.anidb.net/css/icons/touch/android-chrome-512x512.png",
	},
	{
		name: "myanimelist.net",
		buildURL: entry => `https://myanimelist.net/anime.php?q=${entry.title}`,
		icon: "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png",
	},
	{
		name: "anilist.co",
		buildURL: entry => `https://anilist.co/search/anime?search=${entry.title}`,
		icon: "https://anilist.co/img/icons/android-chrome-512x512.png",
	},
	{
		name: "kitsu.io",
		buildURL: entry => `https://kitsu.io/anime?text=${entry.title}`,
		icon: "https://kitsu.io/android-chrome-192x192-6b1404d91a423ea12340f41fc320c149.png",
	},
]