UserInterface.model({
	name: "player.download",
	method: UserInterface.insertBefore,
	properties: {
		tagName: "button",
		id: "atp-player-download",
		textContent: "Download"
	}
})

UserInterface.bind("player.download", async (element, atp, player) => {

	element.addEventListener("click", () => {
		const videoElement = document.querySelector(".AT-player video")
		const anchorElement = document.createElement("a")
		anchorElement.download = videoElement.src
		anchorElement.href = videoElement.src
		anchorElement.click()
	})

})
