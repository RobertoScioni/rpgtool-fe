import { useState, useEffect } from "react"
import MicroElement from "./microElement"
const Scene = (props) => {
	const [users, setUsers] = useState([])
	const getPlayers = async () => {
		let response = await fetch(`${process.env.REACT_APP_BACKEND}/users/`, {
			method: "GET",
			credentials: "include",
			headers: new Headers({
				"Content-Type": "application/json",
			}),
		})
		response = await response.json()
		setUsers([...response])
		console.log("scenes", users)
	}

	useEffect(() => {
		getPlayers()
	}, [])

	return (
		<div className="bg-green-500 w-screen h-screen">
			<div className="flex flex-row h-20 bg-red-100">
				<img src="character.png"></img>
				<div>name</div>
				<div>Description</div>
				<div>close</div>
			</div>
			<div className="h-20 flex justify-between">
				players
				{users.map((element) => (
					<MicroElement entry={element} />
				))}
			</div>
			<div className="bg-blue-900"> FILTERS</div>
			<div className="bg-pink-900 h-full">characters</div>
		</div>
	)
}

export default Scene
