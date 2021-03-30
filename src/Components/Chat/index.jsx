import React, { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import Message from "./message"
import DiceRoller from "./diceRoller"
import CharacterSheet from "./characterSheet"
import io from "socket.io-client"
const connOptions = {
	transports: ["websocket", "polling"],
	query: { db_id: localStorage.getItem("id") },
}

console.log(connOptions)

const test = {
	Counters: [
		{
			name: "Physical Stress",
			min: 0,
			value: 0,
			max: 2,
			abbreviation: "PS",
		},
		{
			name: "Mental Stress",
			min: 0,
			value: 0,
			max: 2,
			abbreviation: "MS",
		},
		{ name: "Fate Points", min: 0, value: 2, max: 2, abbreviation: "FP" },
	],
	Pages: {
		Skills: [
			{ name: "Lore", macro: "[4dF+4]" },
			{ name: "Rapport", macro: "[4dF+3]" },
			{ name: "Crafts", macro: "[4dF+3]" },
			{ name: "Athletics", macro: "[4dF+2]" },
			{ name: "Will", macro: "[4dF+2]" },
			{ name: "Investigate", macro: "[4dF+2]" },
			{ name: "Fight", macro: "[4dF+1]" },
			{ name: "Resources", macro: "[4dF+1]" },
			{ name: "Contacts", macro: "[4dF+1]" },
			{ name: "Notice", macro: "[4dF+1]" },
		],
		Aspects: [
			{ name: "Wizard for hire" },
			{ name: "Rivals in the collegia arcana" },
			{ name: "If i haven't been there, i've read about it" },
			{ name: "not the face!" },
			{ name: "doesn't suffer fools gladly" },
		],

		Consequences: [
			{ name: "Mild", value: "" },
			{ name: "Moderate", value: "" },
			{ name: "Severe", value: "" },
		],
		extras: [],
		Stunts: [
			{
				name: "Scholar,healer",
				dsc: "can attempt physical recovery using Lore",
			},
			{
				name: "Friendly Liar",
				dsc:
					"Can use Rapport in place of Deceive to create advantages predicated on a lie.",
			},
			{
				name: "The Power of Deduction",
				dsc: ` 
					Once per scene you can spend a fate point
					(and a few minutes of observation) to make 
					a special Investigate roll 
					representing your potent deductive faculties.
					For each shift you make on this roll you discover 
					or create an aspect, on either the scene or	
					the target of your observations, 
					though you may only invoke one of them for free.
				`,
			},
			{
				name: "I’ve Read about That!",
				dsc: `
					You’ve read hundreds—if not thousands—of
					books on a wide variety of topics. 
					You can spend a fate point to use
					Lore in place of any other skill 
					for one roll or exchange, provided you
					can justify having read about 
					the action you’re attempting.
				`,
			},
		],
	},
}

let socket = io(process.env.REACT_APP_BACKEND, connOptions) //socket instance
const Chat = () => {
	const { id } = useParams()
	const { sceneId } = useParams()
	console.log("room id", id)
	const [messages, setMessages] = useState([])
	const messageEl = useRef(null)
	const [input, setInput] = useState("")
	const appendInput = (I) => setInput(input.concat(" ", I))
	const [send, setSend] = useState(false)
	const [recipientPlayers, setRecipientPlayers] = useState([])
	const [recipientCharacters, setRecipientCharacters] = useState([])
	const [identity, setIdentity] = useState({})
	const [scene, setScene] = useState({})
	const [user, setUser] = useState({})
	const [roller, setRoller] = useState(false)
	const [sheet, setSheet] = useState(false)

	const getScene = async () => {
		const URL = sceneId
			? `${process.env.REACT_APP_BACKEND}/scenes/${sceneId}`
			: `${process.env.REACT_APP_BACKEND}/campaigns/${id}`
		let response = await fetch(URL, {
			method: "GET",
			credentials: "include",
			headers: new Headers({
				"Content-Type": "application/json",
			}),
		})
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

		let room = { ...response }
		room.id = id

		response = await fetch(
			`${process.env.REACT_APP_BACKEND}/campaigns/${id}/messages`,
			{
				method: "GET",
				credentials: "include",
				headers: new Headers({
					"Content-Type": "application/json",
				}),
			}
		)

		response = await response.json()

		setMessages([...response])

		socket.emit("room", room)
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
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

	const quickRoll = (macro) => {
		console.log("did i get a macro?", macro)
		socket.emit("sendMessage", {
			room: scene._id,
			user: user,
			message: macro,
			toPlayers: recipientPlayers,
			toCharacters: recipientCharacters,
			as: identity,
		})
	}

	useEffect(() => {
		if (messageEl) {
			messageEl.current.addEventListener("DOMNodeInserted", (event) => {
				const { currentTarget: target } = event
				target.scroll({ top: target.scrollHeight, behavior: "smooth" })
			})
		}
	}, [])

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [send])
	useEffect(() => {
		console.log("messages", messages)
		console.log("clients", socket.clients)
	})
	return (
		<div className="flex flex-col h-full p-2 bg-gray-900">
			<a
				href="/Campaigns"
				className="absolute bg-gray-900 rounded-br-full text-yellow-400 px-4 py-1"
			>
				back to dashboard
			</a>
			<div
				className={`border-light-blue-500 overflow-y-hidden bg-gray-600 ${
					roller ? "h-3/5" : "h-full"
				}`}
			>
				<div className="h-full flex flex-row overflow-y-hidden">
					<div
						id="Inbox"
						className="flex-grow px-2 border-r-4 flex flex-col overflow-scroll scrollbar-thin scrollbar-thin-light scrollbar-thumb-yellow-600 overflow-x-hidden"
						ref={messageEl}
					>
						{messages.length > 0 &&
							messages.map((element, index) => (
								<Message element={element} key={`message-${index}`} />
							))}
					</div>
					<div
						id="entitySelector"
						className="flex flex-col items-center h-full overflow-y-scroll scrollbar-thin scrollbar-thumb-yellow-600 min-w-max"
					>
						{scene.members &&
							scene.members.map((player) => (
								<img
									src={player.imageUrl || "character.png"}
									key={`player-${player._id}`}
									className={
										recipientPlayers.length && recipientPlayers.includes(player)
											? " w-20 rounded-full mb-1 ring-4 ring-red-400"
											: " w-20 rounded-full mb-1"
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
														? "w-20 mb-1 ring-4 ring-yellow-400"
														: "w-20 mb-1"
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

						<div
							id="separator"
							className="border-solid border-t-4 w-full"
						></div>
						{user &&
							user.characters &&
							user.characters.map((character) => (
								<img
									src={character.imageUrl}
									key={`myChar-${character._id}`}
									alt={character.name}
									title={character.name}
									onClick={(e) => {
										impersonate(character)
									}}
									className={
										identity._id === character._id
											? "w-20 m-3 ring-4 ring-yellow-400"
											: "w-20 m-3"
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
								alt={user.name}
								className={
									identity._id === user._id
										? "w-20 h-20 m-3 rounded-full ring-4 ring-green-400 object-scale-down bg-gray-500 "
										: "w-20 h-20 rounded-full m-3 object-scale-down bg-gray-500 "
								}
								onClick={(e) => {
									impersonate(user)
								}}
							/>
						)}
					</div>
				</div>
			</div>
			{/* collapsible dice roller*/}
			<div
				className={`  text-gray-300 border-t-4 overflow-y-hidden ${
					roller ? "visible h-2/5 bottom-0" : "invisible h-0"
				}`}
			>
				{sheet ? (
					<CharacterSheet sheet={test} send={quickRoll} />
				) : (
					<DiceRoller appendInput={appendInput} />
				)}
			</div>
			<form
				className="flex bg-gray-600 items-center border-t-4 "
				onSubmit={(e) => {
					e.preventDefault()
					setSend(!send)
				}}
			>
				<input
					type="text"
					placeholder="send message"
					className="flex-grow p-2"
					value={input}
					onChange={(e) => {
						setInput(e.target.value)
					}}
				></input>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 512 512"
					className="h-10 w-10 p-0.5"
					onClick={() => {
						if ((sheet && roller) || !roller) setRoller(!roller)
						setSheet(true)
					}}
				>
					<circle
						cx="256"
						cy="256"
						r="256"
						fill="#000000"
						fillOpacity="1"
					></circle>
					<g className="" transform="translate(0,0)">
						<path
							d="M311.9 47.95c-17.6 0-34.6.7-50.7 2.43L244.6 93.5l-4.9-40.04c-2.5.46-5 .94-7.5 1.47-9.1 1.94-15.1 7.22-20.3 14.87-5.2 7.65-8.9 17.5-12.1 26.6C191 121.5 184 148 178.4 175c6 5.1 12 10.3 17.9 15.4l30.7-17.6 33.8 26.1 51.9-19.7 61 24.5-6.8 16.7-54.4-21.8-54.7 20.7-32.2-24.9-14.9 8.5c19.6 17.3 38.6 34.4 56.5 51.2l14-6.4 33.9 16.1 31.2-13.1 24.2 23.3-12.4 13-15.8-15.1-27.6 11.7-33-15.8c6.9 6.7 13.6 13.2 20.1 19.7l1.7 1.8 19.5 76.3-7.8-5.7-53 .4-38.1-17.8-42.4 14.6-5.8-17 49.2-17 41.1 19.2 24.7-.2-70.7-51.7c-19.7 4.6-39.4 2.8-58.1-3.7-4.2 44.4-5.9 85.7-7 118.7-.4 10.7 2.7 23 7.5 32.5 4.9 9.5 11.7 15.4 15 16.1 5.2 1.2 19 3.2 37.7 5.1l12.4-39 19.1 41.7c16.7 1.2 35 2 53.5 2.2 28.2.3 57.1-.9 82-4.7 15.8-2.3 29.6-6 40.7-10.4-11.8-5.1-21.6-10.6-29.1-16.6-11.1-8.9-18.2-19.3-17.3-30.9v.2c5.4-96.4 10.8-188.8 30.3-286l.1-.4.1-.4c5.3-17.9 17.9-39.86 36.1-55.83-13.9-2.06-28.6-4-43.7-5.66l-22.3 25.3-2.2-27.7c-19-1.64-38.4-2.71-57.4-2.92h-5.7zm148.5 20.44c-4.7 3.69-9.2 8.03-13.3 12.73 12.1 8.18 21.4 23.38 21.8 36.98.3 7.8-1.9 14.9-7.7 21.4-5.8 6.4-15.6 12.4-31.6 15.8l3.8 17.6c18.6-4 32.3-11.5 41.2-21.4 9-9.9 12.7-22.2 12.3-34-.6-19.3-11.1-37.59-26.5-49.11zM25.44 71.91c-.24 1.61-.38 3.43-.38 5.62.1 7.69 2.03 18.17 5.83 30.17 3.41 10.7 8.27 22.5 14.35 34.8 10.63-5.3 20.59-11 28.41-18.1-4.42 12.5-10.15 24.7-18.6 36.5 4.14 7.2 8.63 14.4 13.45 21.5 10.64-5.3 20.72-13 29.52-26.1-3.3 16-8.47 30.6-18.27 41.8 6.53 8.5 13.5 16.8 20.75 24.5 8.7-9.3 15.6-21 20.7-34.9 3.8 18.5 2.6 35.3-5.7 49.4 8 7.2 16.3 13.7 24.8 19.1 6.1-14 8.9-30.6 8.5-49.7 9.2 23.7 11.3 42.9 9.6 59.5 20.2 9.2 40.8 12 61.3 6.1l4.2-1.3 69.3 50.6-5.9-22.8c-73-72.8-175.4-156.7-261.86-226.69zM312.8 123.9l33.2 13.8 31.3-9.9 5.4 17.2-37.5 11.9-33.6-14-28.8 8.1-4.8-17.4zm107.3 236.2c-.7 0-1.3.1-2 .1-3.5.1-7.2.5-11.1 1.3l3.4 17.6c12.2-2.3 20-.4 24.5 2.5 4.4 2.9 6.3 6.8 6.4 12.5.1 9.3-7 23-23.3 32.5 5.4 2.9 11.9 5.9 19.3 8.7 14.4-11.6 22.1-26.8 22-41.4-.1-10.7-5.2-21.2-14.6-27.4-6.7-4.3-15-6.5-24.6-6.4z"
							fill="#fff"
							fillOpacity="1"
						></path>
					</g>
				</svg>

				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 512 512"
					className="h-10 w-10 p-0.5"
					onClick={() => {
						if ((!sheet && roller) || !roller) setRoller(!roller)
						setSheet(false)
					}}
				>
					<circle
						cx="256"
						cy="256"
						r="256"
						fill="#000000"
						fillOpacity="1"
					></circle>
					<g transform="translate(0,0)">
						<path
							d="M248 20.3L72.33 132.6 248 128.8zm16 
								0v108.5l175.7 3.8zm51.4 58.9c6.1 3.5 
								8.2 7.2 15.1 4.2 10.7.8 22.3 5.8 27.6 
								15.7 4.7 4.5 1.5 12.6-5.2 
								12.6-9.7.1-19.7-6.1-14.6-8.3 4.7-2
								14.7.9 10-5.5-3.6-4.5-11-7.8-16.3-5.9-1.6 
								6.8-9.4 4-12-.7-2.3-5.8-9.1-8.2-15-7.9-6.1 
								2.7 1.6 8.8 5.3 9.9 7.9 2.2.2 7.5-4.1 
								5.1-4.2-2.4-15-9.6-13.5-18.3 5.8-7.39 
								15.8-4.62 22.7-.9zm-108.5-3.5c5.5.5 12.3 3 
								10.2 9.9-4.3 7-9.8 13.1-18.1 14.8-6.5 
								3.4-14.9 4.4-21.6 1.9-3.7-2.3-13.5-9.3-14.9-3.4-2.1 
								14.8.7 13.1-11.1 17.8V92.3c9.9-3.9 
								21.1-4.5 30.3 1.3 8 4.2 19.4 1.5 24.2-5.7 
								1.4-6.5-8.1-4.6-12.2-3.4-2.7-8.2 7.9-7.5 
								13.2-8.8zm35 69.2L55.39 149l71.21 192.9zm28.2 
								0l115.3 197L456.6 149zm-14.1 7.5L138.9 352.6h234.2zm133.3 
								21.1c13.9 8.3 21.5 26.2 22.1 43-1.3 13.6-.7 
								19.8-15.2 21.4-14.5 1.6-23.9-19.2-29.7-32.6-3.4-9.9-5.8-24 
								1.7-31.3 6.1-4.8 15-4.1 21.1-.5zm-223.7 16.1c2.1 4-.5 
								11.4-4.8 12.1-4.9.7-3.8-9.3-9.4-11.6-6.9-2.3-13.6 
								5.6-15 11.6 10.4-4 20.3 7.1 20.3 17-.4 11.7-7.9 
								24.8-19.7 28.1h-5.6c-12.7-.7-18.3-15.8-14.2-26.6 
								4.4-15.8 10.8-33.9 27.2-40.6 8.5-3.9 19 3.2 21.2 
								10zm213.9-8.4c-7.1-.1-4.4 10-3.3 14.5 3.5 11.5 7.3 
								26.6 18.9 30 6.8-1.2 4.4-12.8 3.7-16.5-4.7-10.9-7.1-23.3-19.3-28zM52 
								186v173.2l61.9-5.7zm408 0l-61.9 167.5 61.9 5.7zm-117.9.7l28.5 
								63.5-10 4.4-20-43.3c-6.1 3-13 8.9-14.6-1.4-1.3-3.9 8.5-5.1 
								8.1-11.9-.3-6.9 2.2-12.2 8-11.3zm-212 27.4c-2.4 5.1-4.1 
								10.3-2.7 15.9 1.7 8.8 13.5 6.4 15.6-.8 
								2.7-5 3.9-11.7-.5-15.7-4.1-3.4-8.9-2.8-12.4.6zm328.4 
								41.6c-.1 18.6 1.1 39.2-9.7 55.3-.9 1.2-2.2 1.9-3.7 2.5-5.8-4.1-3-11.3 
								1.2-15.5 1 7.3 5.5-2.9 6.6-5.6 1.3-3.2 3.6-17.7-1-10.2.7 4-6.8 13.1-9.3 
								8.1-5-14.4 0-30.5 7-43.5 5.7-6.2 9.9 4.4 8.9 8.9zM59.93 245.5c.59.1 1.34 
								1 2.48 3.6v61.1c-7.3-7-4.47-18-4.45-26.4 0-8.4 1.65-16.3-1.28-23.2-4.62-1.7-5.79-17-3.17-12.7 4.41 4.8 4.66-2.7 6.42-2.4zm178.77 7.6c8.1 4.5 13.8 14.4 10.8 23.6-2.1 15.2-27 21.1-30.4 29.7-1.2 3 25.4 1.6 30.2 1.6.5 4 1.5 10.7-3.8 11.7-14.5-1.2-29.9-.6-45.1-.6.4-11.2 7.4-21.3 17-26.8 6.9-4.9 15.4-9.3 18.1-17.9 1.8-4.5-.6-9.3-4.6-11.5-4.2-2.9-11-2.3-13.2 2.7-2 3.8-4.4 9.1-8.7 9.6-2.9.4-9 .5-7.2-4.9 1.4-5.6 3.4-11.5 8.2-15.2 8.8-6.3 19.9-6.7 28.7-2zm53.3-1.4c6.8 2.2 12 7.9 14.3 14.6 6.1 14.7 5.5 33.1-4.4 45.9-4.5 4.8-10.2 9.1-17 9.1-12.5-.1-22.4-11.1-24.8-22.8-3.1-13.4-1.8-28.7 6.9-39.8 6.8-7.6 16-10.3 25-7zm156.1 8.1c-1.6 5.9-3.3 13.4-.7 19.3 5.1-2 5.4-9.6 6.6-14.5.9-6.1-3.5-12.6-5.9-4.8zm-176.2 21.1c.6 10.5 1.7 22.8 9.7 28.2 4.9 1.8 9.7-2.2 11.1-6.7 1.9-6.3 2.3-12.9 2.4-19.4-.2-7.1-1.5-15-6.7-20.1-12.2-4.4-15.3 10.9-16.5 18zM434 266.8V328l-4.4 6.7v-42.3c-4.6 7.5-9.1 9.1-6.1-.9 6.1-7.1 4.8-17.4 10.5-24.7zM83.85 279c.8 3.6 5.12 17.8 2.04 14.8-1.97-1.3-3.62-4.9-3.41-6.1-1.55-3-2.96-6.1-4.21-9.2-2.95 4-3.96 8.3-3.14 13.4.2-1.6 1.18-2.3 3.39-.7 7.84 12.6 12.17 29.1 7.29 43.5l-2.22 1.1c-10.36-5.8-11.4-19.4-13.43-30-1.55-12.3-.79-24.7 2.3-36.7 5.2-3.8 9.16 5.4 11.39 9.9zm-7.05 20.2c-4.06 4.7-2.26 12.8-.38 18.4 1.11 5.5 6.92 10.2 6.06 1.6.69-11.1-2.33-12.7-5.68-20zm66.4 69.4L256 491.7l112.8-123.1zm-21.4.3l-53.84 4.9 64.24 41.1c-2.6-2.7-4.9-5.7-7.1-8.8-5.2-6.9-10.5-13.6-18.9-16.6-8.75-6.5-4.2-5.3 2.9-2.6-1-1.8-.7-2.6.1-2.6 2.2-.2 8.4 4.2 9.8 6.3l24.7 31.6 65.1 41.7zm268.4 0l-42.4 46.3c6.4-3.1 11.3-8.5 17-12.4 2.4-1.4 3.7-1.9 4.3-1.9 2.1 0-5.4 7.1-7.7 10.3-9.4 9.8-16 23-28.6 29.1l18.9-24.5c-2.3 1.3-6 3.2-8.2 4.1l-40.3 44 74.5-47.6c5.4-6.7 1.9-5.6-5.7-.9l-11.4 6c11.4-13.7 30.8-28.3 40-35.6 9.2-7.3 15.9-9.8 8.2-1.5l-12.6 16c10-7.6.9 3.9-4.5 5.5-.7 1-1.4 2-2.2 2.9l54.5-34.9zM236 385.8v43.4h-13.4v-30c-5-1.4-10.4 1.7-15.3-.3-3.8-2.9 1-6.8 4.5-5.9 3.3-.1 7.6.2 9.3-3.2 4.4-4.5 9.6-4.4 14.9-4zm29 .5c12.1 1.2 24.2.6 36.6.6 1.5 3 .8 7.8-3.3 7.9-7.7.3-21-1.6-25.9.6-8.2 10.5 5.7 3.8 11.4 5.2 7 1.1 15 2.9 19.1 9.2 2.1 3.1 2.7 7.3.7 10.7-5.8 6.8-17 11.5-25.3 10.9-7.3-.6-15.6-1.1-20.6-7.1-6.4-10.6 10.5-6.7 12.2-3.2 6 5.3 20.3 1.9 20.7-4.7.6-4.2-2.1-6.3-6.9-7.8-4.8-1.5-12.6 1-17.3 1.8-4.7.8-9.6.5-9-4.4.8-4.2 2.7-8.1 2.7-12.5.1-3 1.7-7 4.9-7.2zm133.5 5c-.2-.2-7 5.8-9.9 8.1l-15.8 13.1c10.6-6.5 19.3-12 25.7-21.2zm-247 14.2c2.4 0 7.5 4.6 9.4 7l26.1 31.1c-7.7-2.1-13.3-7.1-17.6-13.7-6.5-7.3-11.3-16.6-21.2-19.6-9-5-5.2-6.4 2.1-2.2-.3-1.9.2-2.6 1.2-2.6z"
							fill="#fff"
							fillOpacity="1"
						></path>
					</g>
				</svg>
				<input type="submit" className="p-2" value="send" />
			</form>
		</div>
	)
}
export default Chat
