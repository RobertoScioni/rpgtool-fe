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
import Element from "../element"
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
		<div>
			<div className="flex justify-center my-5 bg-yellow-500 p-1">
				<div>
					<p className=" text-center">NEW SCENE</p>
					<Element save={createElement} />
				</div>
			</div>
			<div className="grid gap-1  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 justify-items-center">
				{scenes.map((scene, index) => (
					<div className="flex bg-yellow-500 w-min p-1">
						<Element
							entry={scene}
							key={`scene-${index}`}
							save={createElement}
						/>
						<div className="">
							<div>
								<a href={`/chat/${scene._id}`}>
									<svg
										className="h-8 w-8 text-green-500"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										title="Start the Scene"
									>
										<polygon points="5 3 19 12 5 21 5 3" />
									</svg>
								</a>
							</div>
							<div>
								<a href={`/scene/${scene._id}`}>
									<svg
										className="h-8 w-8 text-green-500"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
										/>
									</svg>
								</a>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default Scenes