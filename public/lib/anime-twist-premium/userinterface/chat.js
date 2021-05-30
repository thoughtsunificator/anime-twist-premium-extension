const STATE_IDLE = "STATE_IDLE"
const STATE_ENTERING_NICKNAME = "STATE_ENTERING_NICKNAME"

UserInterface.model({
	name: "chat",
	method: UserInterface.appendChild,
	properties: {
		tagName: "div",
		id: "atp-chat"
	}
})

UserInterface.bind("chat", async (element, atp) => {

	let _tabIndex = 0
	let _state = STATE_IDLE
	let _nickname = ""
	let _startsAt = 0
	let _endsAt = 0

	UserInterface.listen(atp, "page rendered", async () => {
		const inputNode = document.querySelector(".chat form:not(.login) input")

		inputNode.addEventListener("input", event => {
			if(event.data === "@") {
				if(_state === STATE_IDLE) {
					_startsAt = event.target.selectionStart
					_endsAt += event.target.selectionStart
					_state = STATE_ENTERING_NICKNAME
				} else {
					_state = STATE_IDLE
					_nickname = ""
				}
			}
			if(event.data.includes(" ")) {
				_state = STATE_IDLE
				_nickname = ""
				_startsAt = 0
				_endsAt = 0
			} else if(_state === STATE_ENTERING_NICKNAME) {
				_nickname += event.data
				_endsAt += event.data.length
			}
		})

		inputNode.addEventListener('click', event => {
			if(_state === STATE_ENTERING_NICKNAME && (event.target.selectionStart < _startsAt || event.target.selectionStart > _endsAt + 1)) {
				ATP.log("chat input clicked outside of the nick boundary")
				_state = STATE_IDLE
				_nickname = ""
				_startsAt = 0
				_endsAt = 0
			}
		})

		inputNode.addEventListener("keyup", event => {
			ATP.log(event.target.selectionStart, _endsAt)
			if(event.keyCode === 13) {
				if(event.target.value === "!random") {
					const entry = atp.search.getRandomEntry(atp.watchList.entries)
					event.target.value = entry.title
				}
			} else if(_state === STATE_ENTERING_NICKNAME && _nickname.length >= 2 && (event.target.selectionStart < _startsAt || event.target.selectionStart > _endsAt + 1)) {
				ATP.log("chat jumped outside of the nick boundary")
				_state = STATE_IDLE
				_nickname = ""
				_startsAt = 0
				_endsAt = 0
			} else if(_state === STATE_ENTERING_NICKNAME && event.keyCode === 9) {
				ATP.log("chat input tab pressed", _tabIndex, _nickname, _startsAt, _endsAt)
				const nicknames = [...document.querySelectorAll(".chat article header a")].map(anchorNode => anchorNode.textContent).filter((value, index, array) => {
					return array.indexOf(value) === index
				})
				const matches = nicknames.filter(nickname => nickname.includes(_nickname.slice(1)))
				event.target.value += matches[0].slice(_nickname.slice(1).length)
				_state = STATE_IDLE
				_nickname = ""
				_startsAt = 0
				_endsAt = 0
			}
		})
	})

})
