import React, { useState, useEffect } from "react"
import { useParams, Linl } from "react-router-dom"
import io from "socket.io-client"
const connOptions = {
	transports: ["websocket", "polling"],
	//auth: {
	//	token: "abc",
	//}, // socket connectin options
}

const user = {
	name: "alphaTester",
	socketid: "Dgg3AUDUMEEMORk-AAAc",
	_id: "18",
	imageUrl: "https://placekitten.com/100/100",
	characters: [
		{
			_id: "01",
			name: "jake of the pecking albatros",
			imageUrl: "https://placekitten.com/100/100",
		},
		{
			_id: "02",
			name: "steven of the treacherous seagul",
			imageUrl: "https://placekitten.com/100/100",
		},
	],
}

let socket = io(process.env.REACT_APP_BACKEND, connOptions) //socket instance
const Chat = () => {
	const { id } = useParams()
	console.log("room id", id)
	const [messages, setMessages] = useState([])
	const [input, setInput] = useState("")
	const [send, setSend] = useState(false)
	const [recipientPlayers, setRecipientPlayers] = useState([])
	const [recipientCharacters, setRecipientCharacters] = useState([])
	const [identity, setIdentity] = useState({})
	const [scene, setScene] = useState({})
	const [user, setUser] = useState({})

	const getScene = async () => {
		let response = await fetch(
			`${process.env.REACT_APP_BACKEND}/scenes/${id}`,
			{
				method: "GET",
				credentials: "include",
				headers: new Headers({
					"Content-Type": "application/json",
				}),
			}
		)
		response = await response.json()
		console.log("scene fetched", response)
		setScene({ ...response })
	}

	useEffect(() => {
		getScene()
	}, [])

	useEffect(() => {
		console.log("this should connect to the backend")
		console.log("scene saved", scene)
		socket.on("message", (message) =>
			setMessages((messages) => messages.concat(message))
		)
		socket.on("connect", () => {
			socket.emit("room", scene)
			console.log("connected to socket ", socket.id)
		}) //check if socket is connected
		return () => socket.removeAllListeners() //componentWillUnmount
	}, [scene])

	const toggleCharacterInRecipients = (character) => {
		if (!recipientCharacters.includes(character)) {
			setRecipientCharacters(() => recipientCharacters.concat(character))
		} else {
			const update = [...recipientCharacters]
			update.splice(
				recipientCharacters.findIndex(
					(element) => element._id === character._id
				),
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
				recipientPlayers.findIndex((element) => element._id === player._id),
				1
			)
			setRecipientPlayers(update)
		}
	}

	const impersonate = (character) => {
		console.log("change identity", character._id)

		if (character._id !== identity._id) {
			console.log("into ", character.name)
			setIdentity(character)
		} else {
			console.log("back to yourself", user.name)
			setIdentity(user)
		}
	}

	useEffect(() => {
		if (send) {
			console.log("this should send a message")
			socket.emit("sendMessage", {
				room: scene.name,
				username: "me",
				message: input,
			})
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
							messages.map((element) => (
								<div key={`message-${element._id}`}>{element.text}</div>
							))}
					</div>
					<div
						id="entitySelector"
						className="box-content border-solid border-4 h-full max-h-full overflow-y-scroll w-max"
					>
						<div id="notMine h-full">
							{scene.members &&
								scene.members.map((player) => (
									<img
										src={player.imageUrl || "character.png"}
										key={`player-${player._id}`}
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

							{scene.members &&
								scene.members.map((player) =>
									player.characters.length
										? player.characters.map((character) => (
												<img
													src={character.imageUrl}
													key={`character-${character._id}`}
													className={
														recipientCharacters.length &&
														recipientCharacters.includes(character)
															? "w-20 m-2 ring-4 ring-indigo-400"
															: "w-20 m-2"
													}
													title={character.name}
													alt={character.name}
													onClick={(e) => {
														toggleCharacterInRecipients(character)
													}}
												/>
										  ))
										: ""
								)}
						</div>
						<div
							id="myEntities"
							className="border-solid border-t-4 align-bottom "
						>
							{/*user &&
								user.characters.length &&
								user.characters.map((character) => (
									<img
										src={character.imageUrl}
										key={`myChar-${character._id}`}
										className="m-1"
										title={character.name}
										onClick={(e) => {
											impersonate(character)
										}}
										className={
											identity._id === character._id
												? "m-2 ring-4 ring-indigo-400"
												: "m-2"
										}
									/>
									))*/}
							{/*user && (
								<img
									src={user.imageUrl}
									className="m-1 rounded-full"
									title={user.name}
									className={
										identity._id === user._id
											? "m-2 rounded-full ring-4 ring-indigo-400"
											: "rounded-full m-2"
									}
									onClick={(e) => {
										impersonate(user)
									}}
								/>
								)*/}
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
