import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"

import MicroElement from "../microElement"
const Scene = (props) => {
	let { id } = useParams()
	const [users, setUsers] = useState([])
	const [scene, setScene] = useState({})
	const [players, setPlayers] = useState([])
	const [characters, setCharacters] = useState([])

	const getPlayers = async () => {
		let response = await fetch(`${process.env.REACT_APP_BACKEND}/users/`, {
			method: "GET",
			credentials: "include",
			headers: new Headers({
				"Content-Type": "application/json",
			}),
		})
		response = await response.json()
		response = response.filter((user) => {
			return !players.some((player) => {
				if (player._id === user._id) {
					player.characters = user.characters
					return true
				} else return false
			})
		})
		setUsers([...response])
		console.log("scenes", users)
	}

	const save = async () => {
		console.log("save the scene")
		const container = { ...scene }
		container.members = JSON.parse(JSON.stringify(players))
		container.members = container.members.map((player) => {
			//player.characters = [...player.characters]
			console.log(
				"players characters before the filter",
				JSON.stringify(player.characters)
			)
			player.characters = player.characters.filter((character) =>
				characters.includes(character._id)
			)
			return player
		})

		let response = await fetch(
			`${process.env.REACT_APP_BACKEND}/scenes/${id}`,
			{
				method: "PUT",
				credentials: "include",
				body: JSON.stringify(container),
				headers: new Headers({
					"Content-Type": "application/json",
				}),
			}
		)
		response = await response.json()
	}

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
		setScene({ ...response })
		setPlayers([...response.members])
		setCharacters(
			[].concat.apply(
				[],
				response.members.map((player) =>
					player.characters.map((character) => character._id)
				)
			)
		)
		console.log("scenes", users)
	}

	const userToPlayer = (user) => {
		let usr = [...players, user]
		console.log("usr.lenght ", usr.length)
		if (usr.length !== 0) {
			usr = usr.sort((a, b) => {
				console.log(
					"sort it gdit",
					user.name,
					a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1
				)
				return a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1
			})
		}
		setPlayers(usr)
		setUsers(users.filter((entry) => entry._id !== user._id))
	}

	const playertoUser = (user) => {
		let usr = [...users, user]
		if (usr.length) {
			usr = usr.sort((a, b) =>
				a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1
			)
		}
		setUsers(usr)
		setPlayers(players.filter((entry) => entry._id !== user._id))
	}

	const addCharacter = (character) => {
		console.log("add character")
		setCharacters([...characters, character._id])
	}

	const removeCharacter = (character) => {
		console.log("remove character", character._id, typeof character._id)
		setCharacters([...characters].filter((_id) => _id !== character._id))
	}

	useEffect(() => {
		//in the beginning load the scene
		getScene()
	}, [])

	useEffect(() => {
		getPlayers()
		console.log("players changed", players)
	}, [players])

	const newBody = () => {
		const container = { ...scene }
		container.players = JSON.parse(JSON.stringify(players))
		container.players = container.players.map((player) => {
			player.characters = [...player.characters]
			player.characters = player.characters.filter((character) =>
				characters.includes(character._id)
			)
			return player
		})
		return container
	}

	useEffect(() => {
		console.log("body for the put fetch - ", newBody())
	})

	return (
		<div className="flex flex-col w-full min-h-full bg-green-500">
			<div className="flex flex-row h-20 bg-red-100">
				<img
					src={scene.imageUrl || "character.png"}
					className="object-scale-down max-w-full max-h-full p-2"
					alt="avatar"
				></img>
				<div>{scene.name}</div>
				<div>{scene.description}</div>
				<div id="save" className="ml-1" onClick={(e) => save()}>
					<svg
						class="h-10 w-10 text-green-600"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />{" "}
						<polyline points="17 21 17 13 7 13 7 21" />{" "}
						<polyline points="7 3 7 8 15 8" />
					</svg>
				</div>
				<Link id="close" className="ml-1" to="/scenes">
					<svg
						class="h-10 w-10 text-red-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</Link>
				<Link id="open" className="ml-1" to={`/chat/${id}`}>
					<svg
						class="h-10 w-10 text-green-600"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polygon points="5 3 19 12 5 21 5 3" />
					</svg>
				</Link>
			</div>
			<div className="h-20 flex w-full">
				{players.map((element, index) => (
					<div className="relative" key={`player-${index}`}>
						<MicroElement entry={element} action={playertoUser} />
						<div className="absolute top-0 right-0 rounded-full bg-gray-500 p-1">
							<svg
								className="h-5 w-5 text-green-300"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								{" "}
								<polyline points="20 6 9 17 4 12" />
							</svg>
						</div>
					</div>
				))}
				<div className="flex-grow"></div>
				{users.map((element, index) => (
					<MicroElement
						entry={element}
						action={userToPlayer}
						key={`user-${index}`}
					/>
				))}
			</div>
			<div className="bg-blue-900"> FILTERS</div>
			<div className="bg-pink-900 flex-grow grid grid-cols-5">
				{players.map((player) =>
					//console.log("this user is a player:", player)
					player.characters.map((character, index) => {
						const selected = characters.includes(character._id)
						const action = selected ? removeCharacter : addCharacter
						return (
							<div className="relative w-16">
								<MicroElement
									entry={character}
									key={`character-${index}`}
									action={action}
								/>
								{selected && (
									<div className="absolute top-0 right-0 rounded-full bg-gray-500 p-1">
										<svg
											className="h-5 w-5 text-green-300"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<polyline points="20 6 9 17 4 12" />
										</svg>
									</div>
								)}
							</div>
						)
					})
				)}
			</div>
		</div>
	)
}

export default Scene
