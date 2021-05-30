/*
Copyright (c) 2019, Romain Lebesle

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import COMMANDS from "../data/commands.js"

export const PREFIX_COMMAND = "/"

export default class CommandProcessor {

	constructor(irc) {
		this.irc = irc
	}

	get irc() { return this._irc }
	set irc(irc) { this._irc = irc }

	run(str) {
		const tokens = str.trim().substr(1).split(" ")
		const name = tokens[0].toLowerCase()
		let args = []
		if (tokens.length > 1) {
			args = tokens.slice(1)
		}
		for (const item of COMMANDS) {
			const itemTokens = item.command.split(" ")
			const itemName = itemTokens[0].toLowerCase()
			let itemArgs = []
			if (itemTokens.length > 1) {
				itemArgs = itemTokens.slice(1)
			}
			const itemData = {}
			if(itemName === name) {
				for (const [index, arg] of itemArgs.entries()) {
					const optional = arg.substr(1, 1) === "?"
					let argName
					if(optional === true) {
						argName = arg.substr(2, arg.length - 3)
					} else {
						argName = arg.substr(1, arg.length - 2)
					}
					if (index + 1 > args.length && optional === false) {
						this.irc.emit("irc message", `Missing args, syntax is : ${item.command}`)
						return
					} else {
						itemData[argName] = args[index]
					}
				}
				const eventArgs = { ...item.args, ...itemData }
				const keys = Object.keys(eventArgs)
				if(keys.length === 0) {
					this.irc.emit(item.event)
				} else if (keys.length === 1) {
					this.irc.emit(item.event, eventArgs[keys[0]])
				} else {
					this.irc.emit(item.event, eventArgs)
				}
				return
			}
		}
		this.irc.emit("irc message", `Command not found`)
	}
}