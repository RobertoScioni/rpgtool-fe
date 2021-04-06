import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import * as fetches from "../fetches"

import MicroElement from "../microElement"
const Campaign = (props) => {
	let { id, campaignId } = useParams()
	const [users, setUsers] = useState([])
	const [campaign, setCampaign] = useState({})
	const [players, setPlayers] = useState([])
	const [characters, setCharacters] = useState([])
	const [filter, setFilter] = useState("")

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
		console.log("campaigns", users)
	}

	const save = async () => {
		console.log("save the campaign")
		const container = { ...campaign }
		container.members = JSON.parse(JSON.stringify(players))
		container.members = container.members.map((player) => {
			//player.characters = [...player.characters]
			console.log(
				"players characters before the filter",
				JSON.stringify(player.characters)
			)
			player.characters = characters.filter((character) =>
				player.characters.some((pc) => pc._id === character)
			) /*player.characters.filter((character) =>
				characters.includes(character._id)
			)*/
			return player
		})

		let response = await fetch(
			`${process.env.REACT_APP_BACKEND}/${
				campaignId ? "scenes" : "campaigns"
			}/${id}`,
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
		console.log(response)
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
		//in the beginning load the campaign
		console.log("id ", id, "campaignID ", campaignId)
		//getCampaign()
		const get = async () => {
			let response = await fetches.get(
				`${campaignId ? "scenes" : "campaigns"}/${id}`
			)
			setCampaign(response)
			setPlayers(response.members)
			setCharacters(
				[].concat.apply(
					[],
					response.members.map(
						(player) => {
							console.log("###-", JSON.stringify(player))
							return player.characters
								? player.characters.map((character) => character._id)
								: ""
						}
						//player.characters.map((character) => character._id)
					)
				)
			)
		}
		get()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		getPlayers()

		console.log("players changed", players)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [players])

	return (
		<div className="flex flex-col w-screen min-h-full ">
			<div className="flex flex-row items-center h-20 p-2 bg-gray-500">
				<div className="flex justify-content-center align-center bg-gray-300 mr-2">
					<img
						src={campaign.imageUrl || "character.png"}
						className="object-scale-down w-20 p-2"
						alt="avatar"
					></img>
				</div>
				<div>
					<div className="w-max font-bold">
						Players and Characters manager for:
					</div>
					<div>{campaign.name}</div>
				</div>
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
						<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
						<polyline points="17 21 17 13 7 13 7 21" />
						<polyline points="7 3 7 8 15 8" />
					</svg>
				</div>

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

				<div className=" text-right w-full">
					<a href="/Campaigns" className=" text-yellow-500 bold">
						back to:My Campaigns Manager
					</a>
				</div>
			</div>
			<div className="h-24 p-2 gap-2 flex w-full items-center">
				{players &&
					players.map((element, index) => (
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
				<div className="flex-grow text-center text-gray-300 font-bold">
					{" "}
					PLAYERS{" "}
				</div>
				{users.map((element, index) => (
					<MicroElement
						entry={element}
						action={userToPlayer}
						key={`user-${index}`}
					/>
				))}
			</div>
			<div className="flex justify-center mt-2 text-gray-300 font-bold">
				CHARACTERS
			</div>
			<div className="flex justify-center mb-2">
				<input
					type="text"
					placeholder="search characters by name"
					value={filter}
					className="p-1"
					onChange={(e) => setFilter(e.target.value)}
				/>
			</div>
			<div className="flex-grow px-2 justify-items-center">
				{players &&
					players.map((player) => (
						<div>
							<p className="text-white bold">{player.name}</p>
							<div className="flex flex-row flex-wrap gap-2">
								{player.characters &&
									player.characters
										.filter((element) => {
											if (filter === "") return true
											if (element.name.includes(filter)) return true
											return false
										})
										.map((character, index) => {
											const selected = characters.includes(character._id)
											const action = selected ? removeCharacter : addCharacter
											return (
												<MicroElement
													entry={character}
													key={`character-${index}`}
													action={action}
													selected={selected}
												/>
											)
										})}
							</div>
						</div>
					))}
			</div>
		</div>
	)
}

export default Campaign
