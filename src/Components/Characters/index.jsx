/**
 * feture list:
 * list characters
 * create a scene
 * edit a scene
 * add players to a scene
 * add characters to the scene may need a player character list component
 */
import { useState, useEffect } from "react"
import Element from "../element"
const Scenes = () => {
	const [characters, setCharacters] = useState([])
	const [reload, setReload] = useState(false)
	const getElements = async () => {
		let response = await fetch(
			`${process.env.REACT_APP_BACKEND}/users/my-chars`,
			{
				method: "GET",
				credentials: "include",
				headers: new Headers({
					"Content-Type": "application/json",
				}),
			}
		)
		response = await response.json()
		setCharacters([...response])
		console.log("characters", characters)
	}

	const createElement = async (entry) => {
		console.log(
			"********************************************************************************"
		)
		console.log("entry ", entry)
		try {
			if (entry.file.length === 0) {
				throw new Error("character picture is mandatory")
			}
			let id = await fetch(
				`${process.env.REACT_APP_BACKEND}/characters/${
					entry._id ? entry._id : ""
				}`,
				{
					method: `${entry._id ? "PUT" : "POST"}`,
					credentials: "include",
					body: JSON.stringify({ name: entry.name, dsc: entry.dsc }),
					headers: new Headers({
						"Content-Type": "application/json",
					}),
				}
			)
			id = entry._id ? entry._id : await id.json()
			console.log(id)
			const formData = new FormData()
			formData.append("image", entry.file, entry.file.name)
			let response = await fetch(
				`${process.env.REACT_APP_BACKEND}/characters/imageUpload/${id}`,
				{
					method: "POST",
					credentials: "include",
					body: formData,
					headers: new Headers({}),
				}
			)
			console.log("response", response)
			setReload(!reload)
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		getElements()
	}, [])

	useEffect(() => {
		getElements()
	}, [reload])
	return (
		<div className="flex flex-col">
			<div className="flex justify-center my-5 bg-yellow-500 p-1">
				<div>
					<p className=" text-center">NEW CHARACTER</p>
					<Element save={createElement} />
				</div>
			</div>
			<div className="grid gap-1  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 justify-items-center">
				{characters.map((scene, index) => (
					<Element entry={scene} key={`scene-${index}`} save={createElement} />
				))}
			</div>
		</div>
	)
}

export default Scenes
