import React, { useState, useEffect } from "react"
import io from "socket.io-client"
const connOptions = {
	transports: ["websocket", "polling"],
	//auth: {
	//	token: "abc",
	//}, // socket connectin options
}

const user = {
	name: "alphaTester",
	picUrl: "https://placekitten.com/100/100",
	characters: [
		{
			name: "jake of the pecking albatros",
			picUrl: "https://placekitten.com/100/100",
		},
		{
			name: "steven of the treacherous seagul",
			picUrl: "https://placekitten.com/100/100",
		},
	],
}

const scene = {
	name: "High Noon",
	players: [
		{
			socketid: "Dgg3AUDUMEEMORk-AAAc",
			name: "alphaTester",
			picUrl: "https://placekitten.com/100/100",
			characters: [
				{
					name: "jake of the pecking albatros",
					picUrl: "https://placekitten.com/100/100",
				},
				{
					name: "steven of the treacherous seagul",
					picUrl: "https://placekitten.com/100/100",
				},
			],
		},
		{
			socketid: "Dgg3AUDUMEEMORk-AAAc",
			name: "beta",
			picUrl: "https://placekitten.com/100/100",
			characters: [
				{
					name: "jake of the pecking albatros",
					picUrl: "https://placekitten.com/100/100",
				},
				{
					name: "steven of the treacherous seagul",
					picUrl: "https://placekitten.com/100/100",
				},
			],
		},
		{
			socketid: "Dgg3AUDUMEEMORk-AAAc",
			name: "gamma",
			picUrl: "https://placekitten.com/100/100",
			characters: [
				{
					name: "jake of the pecking albatros",
					picUrl: "https://placekitten.com/100/100",
				},
				{
					name: "steven of the treacherous seagul",
					picUrl: "https://placekitten.com/100/100",
				},
			],
		},
		{
			socketid: "Dgg3AUDUMEEMORk-AAAc",
			name: "nope",
			picUrl: "https://placekitten.com/100/100",
			characters: [
				{
					name: "jake of the pecking albatros",
					picUrl: "https://placekitten.com/100/100",
				},
				{
					name: "steven of the treacherous seagul",
					picUrl: "https://placekitten.com/100/100",
				},
			],
		},
	],
}

let socket = io("127.0.0.1:9999", connOptions) //socket instance
const Chat = () => {
	const [messages, setMessages] = useState([])
	const [input, setInput] = useState("")
	const [send, setSend] = useState(false)
	const [recipientPlayers, setRecipientPlayers] = useState([])
	const [recipientCharacters, setRecipientCharacters] = useState([])
	const toggleCharacterInRecipients = (character) => {
		if (!recipientCharacters.includes(character)) {
			setRecipientCharacters(() => recipientCharacters.concat(character))
		} else {
			const update = [...recipientCharacters]
			update.splice(
				recipientCharacters.findIndex((element) => element === character),
				1
			)
			setRecipientCharacters(update)
		}
	}
	const togglePlayerInRecipients = (player) => {
		if (!recipientPlayers.includes(player)) {
			setRecipientPlayers(() => recipientPlayers.concat(player))
		} else {
			const update = [...recipientPlayers]
			update.splice(
				recipientPlayers.findIndex((element) => element === player),
				1
			)
			setRecipientPlayers(update)
		}
	}
	useEffect(() => {
		console.log("this should connect to the backend")
		socket.on("message", (message) =>
			setMessages((messages) => messages.concat(message))
		)
		socket.on("connect", () => console.log("connected to socket ", socket.id)) //check if socket is connected
		return () => socket.removeAllListeners() //componentWillUnmount
	}, [])
	useEffect(() => {
		if (send) {
			console.log("this should send a message")
			socket.emit("sendMessage", { username: "me", message: input })
			console.log("if you are reading this emit did not cause a crash")
			setSend(!send)
			//console.log(socket)
		}
	}, [send])
	useEffect(() => {
		console.log("messages", messages)
		console.log("clients", socket.clients)
	})
	return (
		<div className="h-screen flex flex-col">
			<div className="bg-red-800 p-1 m-2 mb-0">menu area</div>
			<div className="flex-grow border-solid border-4 border-light-blue-500 mx-2 overflow-y-hidden">
				<div className="h-full flex flex-row overflow-y-hidden">
					<div
						id="Inbox"
						className="flex-grow border-solid border-4 overflow-y-scroll"
					>
						{messages.length > 0 &&
							messages.map((element) => <div>{element.text}</div>)}
					</div>
					<div
						id="entitySelector"
						className="box-content border-solid border-4 h-full max-h-full overflow-y-scroll w-max"
					>
						<div id="notMine h-full">
							{scene &&
								scene.players.length &&
								scene.players.map((player) => (
									<img
										src={player.picUrl}
										className={
											recipientPlayers.length &&
											recipientPlayers.includes(player)
												? "m-2 rounded-full ring-4 ring-indigo-400"
												: "m-2 rounded-full"
										}
										title={player.name}
										alt={player.name}
										onClick={(e) => {
											togglePlayerInRecipients(player)
										}}
									/>
								))}

							{scene &&
								scene.players.length &&
								scene.players.map(
									(player) =>
										player.characters.length &&
										player.characters.map((character) => (
											<img
												src={character.picUrl}
												className={
													recipientCharacters.length &&
													recipientCharacters.includes(character)
														? "m-2 ring-4 ring-indigo-400"
														: "m-2"
												}
												title={character.name}
												alt={character.name}
												onClick={(e) => {
													toggleCharacterInRecipients(character)
												}}
											/>
										))
								)}
						</div>
						<div
							id="myEntities"
							className="border-solid border-t-4 align-bottom "
						>
							{user &&
								user.characters.length &&
								user.characters.map((character) => (
									<img
										src={character.picUrl}
										className="m-1"
										title={character.name}
									/>
								))}
							{user && (
								<img
									src={user.picUrl}
									className="m-1 rounded-full"
									title={user.name}
								/>
							)}
						</div>
					</div>
				</div>
			</div>
			<form
				className="flex"
				onSubmit={(e) => {
					e.preventDefault()
					setSend(!send)
				}}
			>
				<input
					type="text"
					placeholder="send message"
					className="flex-grow m-2 mt-0 p-2"
					value={input}
					onChange={(e) => {
						setInput(e.target.value)
					}}
				></input>
				<input type="submit" className="m-2 p-2" />
			</form>
		</div>
	)
}
export default Chat
