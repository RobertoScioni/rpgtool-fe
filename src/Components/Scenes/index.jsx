/**
 * feture list:
 * list scenes
 * create a scene
 * edit a scene
 * add players to a scene
 * add characters to the scene may need a player character list component
 */
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Element from "../element"
const Scenes = () => {
	let { id } = useParams()
	const [campaign, setCampaign] = useState({})
	const [scenes, setScenes] = useState([])
	const [reload, setReload] = useState(false)
	const getElements = async () => {
		let response = await fetch(
			`${process.env.REACT_APP_BACKEND}/campaigns/${id}`,
			{
				method: "GET",
				credentials: "include",
				headers: new Headers({
					"Content-Type": "application/json",
				}),
			}
		)
		response = await response.json()
		setCampaign({ ...response })
		setScenes([...response.scenes])
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
			let body = {
				name: entry.name,
				dsc: entry.dsc,
				campaign: id,
				members: campaign.members,
			}
			if (!entry.id) body.members = [...campaign.members]
			let _id = await fetch(
				`${process.env.REACT_APP_BACKEND}/scenes/${entry._id ? entry._id : ""}`,
				{
					method: `${entry._id ? "PUT" : "POST"}`,
					credentials: "include",
					body: JSON.stringify(body),
					headers: new Headers({
						"Content-Type": "application/json",
					}),
				}
			)
			_id = entry._id ? entry._id : await _id.json()
			console.log(id)
			const formData = new FormData()
			formData.append("image", entry.file, entry.file.name)
			let response = await fetch(
				`${process.env.REACT_APP_BACKEND}/scenes/imageUpload/${_id}`,
				{
					method: "POST",
					credentials: "include",
					body: formData,
					headers: new Headers({}),
				}
			)
			console.log("response", response)
			response = await fetch(
				`${process.env.REACT_APP_BACKEND}/campaigns/${id}/addScene/${_id}`,
				{
					method: "POST",
					credentials: "include",
					//body: JSON.stringify({ scene: _id }),
					headers: new Headers({}),
				}
			)
			setReload(!reload)
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		getElements()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		getElements()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reload])
	return (
		<div>
			<div className="flex flex-row items-center h-20 p-2 bg-gray-500 mb-5">
				<div className="flex justify-content-center align-center bg-gray-300 mr-2">
					<img
						src={campaign.imageUrl || "character.png"}
						className="object-scale-down w-20 p-2"
						alt="avatar"
					></img>
				</div>
				<div>
					<div className="w-max font-bold">Scene manager for:</div>
					<div>{campaign.name}</div>
				</div>
				<div className=" text-right w-full">
					<a href="/Campaigns" className=" text-yellow-500 bold">
						back to:My Campaigns Manager
					</a>
				</div>
			</div>

			<div className="grid   grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 justify-items-center gap-1">
				<div className="flex ring-2 ring-yellow-500 p-2 rounded-md bg-gray-700">
					<Element save={createElement} placeholder="New Scene" />
					<div className="w-10"></div>
				</div>
				{scenes.map((scene, index) => (
					<div className="flex ring-2 ring-yellow-500 p-2 rounded-md bg-gray-700">
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
