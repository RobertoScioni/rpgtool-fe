import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Message from "./message"
import io from "socket.io-client"
const connOptions = {
	transports: ["websocket", "polling"],
	query: { db_id: localStorage.getItem("id") },
}

console.log(connOptions)

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

		setUser(
			response.members.find(
				(member) => member._id === localStorage.getItem("id")
			)
		)

		setIdentity(
			response.members.find(
				(member) => member._id === localStorage.getItem("id")
			)
		)

		response.members = response.members.filter(
			(member) => member._id !== localStorage.getItem("id")
		)
		setScene({ ...response })

		socket.emit("room", response)
	}

	useEffect(() => {
		socket.on("connect", () => {
			console.log("connected to socket ", socket.id)
		})
		socket.on("message", (message) => {
			console.log("message incoming", message)
			setMessages((messages) => messages.concat(message))
		})
		getScene()
	}, [])

	useEffect(() => {})

	useEffect(() => {
		console.log("this should connect to the backend")
		console.log("scene saved", scene)
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
				room: scene._id,
				user: user,
				message: input,
				toPlayers: recipientPlayers,
				toCharacters: recipientCharacters,
				as: identity,
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
		<div className="flex flex-col h-full">
			<div className="flex-grow border-solid border-4 border-light-blue-500 mx-2 overflow-y-hidden">
				<div className="h-full flex flex-row ">
					<div
						id="Inbox"
						className="flex-grow border-solid border-4 flex flex-col"
					>
						{messages.length > 0 &&
							messages.map((element, index) => (
								<Message element={element} key={`message-${index}`} />
								/*<div
									className={`m-1 p-2 w-min max-w1/2 flex border-2 border-black  ${
										element.sender._id === localStorage.getItem("id")
											? "self-end flex-row-reverse text-right"
											: "self-start flex-row"
									} ${
										element.as.hasOwnProperty("characters")
											? "rounded-xl bg-indigo-100 "
											: "bg-blue-300"
									}`}
									key={`message-${index}`}
								>
									<div
										className={`w-20 ${
											element.as.hasOwnProperty("characters")
												? "rounded-full"
												: ""
										}`}
									>
										<img
											src={
												element.as.imageUrl ||
												"https://res.cloudinary.com/ratanax/image/upload/v1616546238/rpgTool/scenes/ttlrrin7qj3visuxtxyh.jpg"
											}
											className={`w-20 bg-gray-800 ${
												element.as.hasOwnProperty("characters")
													? "rounded-full bg-blue-300"
													: ""
											}`}
											alt="speaker face"
										/>
									</div>

									<div className="w-64 overflow-ellipsis break-words px-1 cursor-default">
										<div className=" font-bold underline">
											{element.sender.name}
											{element.as.hasOwnProperty("characters")
												? ""
												: ` as ${element.as.name}`}
										</div>
										<div>
											{element.splitted.map((fragment) => (
												<span
													className={`${
														element.rollMap[fragment] ? "font-bold mx-1" : ""
													}`}
													title={element.rollMap[fragment] ? fragment : ""}
												>
													{element.rollMap[fragment] || fragment}
												</span>
											))}
										</div>
									</div>
								</div>
							*/
							))}
					</div>
					<div
						id="entitySelector"
						className="box-content border-solid border-4 h-full overflow-y-hidden w-max"
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
							{user &&
								user.characters &&
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
												? "w-20 m-2 ring-4 ring-indigo-400"
												: "w-20 m-2"
										}
									/>
								))}
							{user && (
								<img
									src={
										user.imageUrl ||
										"https://res.cloudinary.com/ratanax/image/upload/v1616546238/rpgTool/scenes/ttlrrin7qj3visuxtxyh.jpg"
									}
									title={user.name}
									className={
										identity._id === user._id
											? "w-20 h-20 m-2 rounded-full ring-4 ring-indigo-400 object-scale-down bg-gray-500"
											: "w-20 h-20 rounded-full m-2 object-scale-down bg-gray-500"
									}
									onClick={(e) => {
										impersonate(user)
									}}
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
				<input type="submit" className="m-2 p-2" value="send message" />
			</form>
		</div>
	)
}
export default Chat
