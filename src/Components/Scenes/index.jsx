/**
 * feture list:
 * list scenes
 * create a scene
 * edit a scene
 * add players to a scene
 * add characters to the scene may need a player character list component
 */
import { useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import Element from "./element"
const Scenes = () => {
	const [scenes, setScenes] = useState([])
	const [reload, setReload] = useState(false)
	const getElements = async () => {
		let response = await fetch(`${process.env.REACT_APP_BACKEND}/scenes/`, {
			method: "GET",
			credentials: "include",
			headers: new Headers({
				"Content-Type": "application/json",
			}),
		})
		response = await response.json()
		setScenes([...response])
		console.log("scenes", scenes)
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
				`${process.env.REACT_APP_BACKEND}/scenes/${entry._id ? entry._id : ""}`,
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
				`${process.env.REACT_APP_BACKEND}/scenes/imageUpload/${id}`,
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
		<div className="h-screen flex flex-col">
			<div className="bg-red-800 p-1 m-2 mb-0">menu area</div>
			<div className="flex-grow bg-blue-500 border-solid border-4 border-light-blue-500 mx-2 overflow-y-hidden">
				{scenes.map((scene, index) => (
					<Element entry={scene} key={`scene-${index}`} save={createElement} />
				))}
				<Element save={createElement} />
			</div>
		</div>
	)
}

export default Scenes
