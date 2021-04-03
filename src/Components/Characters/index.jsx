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
import MicroElement from "../microElement"
const Scenes = (props) => {
	const [characters, setCharacters] = useState([])
	const [reload, setReload] = useState(false)
	const [templates, setTemplates] = useState([])
	const [me, setMe] = useState({})
	const [editProfile, setEditProfile] = useState(false)
	const [remove, setRemove] = useState("")
	const [sheet, setSheet] = useState(-1)
	const id = props._id ? props._id : localStorage.getItem("id")

	const del = async (_id) => {
		let response = await fetch(
			`${process.env.REACT_APP_BACKEND}/characters/${_id}`,
			{
				method: "DELETE",
				credentials: "include",
				headers: new Headers({
					"Content-Type": "application/json",
				}),
			}
		)
		response = await response.body
		console.log("###DELETE###")
		console.log(response)
		setRemove(false)
		setReload(!reload)
	}

	const getMe = async () => {
		let response = await fetch(`${process.env.REACT_APP_BACKEND}/users/me`, {
			method: "GET",
			credentials: "include",
			headers: new Headers({
				"Content-Type": "application/json",
			}),
		})
		response = await response.json()
		setMe(response)
		console.log("#me", me)
	}

	const saveMe = async (entry) => {
		console.log(
			"********************************************************************************"
		)
		console.log("entry ", entry)
		try {
			let id = await fetch(`${process.env.REACT_APP_BACKEND}/users/me`, {
				method: `PUT`,
				credentials: "include",
				body: JSON.stringify({
					name: entry.name,
					dsc: entry.dsc,
					sheet: templates[sheet].sheet,
				}),
				headers: new Headers({
					"Content-Type": "application/json",
				}),
			})
			id = entry._id
			console.log(id)
			const formData = new FormData()
			formData.append("image", entry.file, entry.file.name)
			let response = await fetch(
				`${process.env.REACT_APP_BACKEND}/users/imageUpload/me`,
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

	const getElements = async () => {
		console.log("###id", id)
		let response = await fetch(
			`${process.env.REACT_APP_BACKEND}/characters/byUser/${id}`,
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

	const getTemplates = async () => {
		console.log("###id", id)
		let response = await fetch(`${process.env.REACT_APP_BACKEND}/templates`, {
			method: "GET",
			credentials: "include",
			headers: new Headers({
				"Content-Type": "application/json",
			}),
		})
		response = await response.json()
		setTemplates([...response])
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
					body: JSON.stringify({
						name: entry.name,
						dsc: entry.dsc,
						sheet: templates[sheet].sheet,
					}),
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

	useEffect(
		(props) => {
			console.log(props ? props.params._id : localStorage.getItem("id"))
			getMe()
			getElements()
			getTemplates()
			console.log("change in props")
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[props]
	)
	useEffect(() => {
		getMe()
		getElements()
		getTemplates()
		console.log("reloading")
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reload])
	return (
		<div className="flex flex-col pb-6">
			<div className="flex justify-between mb-5 bg-gray-600 p-1 px-4">
				<div className="flex">
					<div
						onClick={() => {
							setEditProfile(!editProfile)
						}}
					>
						<MicroElement entry={me} />
					</div>
					<div
						className={`fixed top-24 shadow-md p-2 rounded-md bg-yellow-400 ${
							!editProfile ? "hidden" : ""
						}`}
					>
						<Element entry={me} save={saveMe} edit={true} />
					</div>
					<p className=" text-yellow-500 bold">My Characters Manager</p>
				</div>

				<div className="p-2">
					<div>
						<a className=" self-end" href="/Campaigns">
							<svg
								className=" inline h-8 w-8 text-green-500"
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
							<span className=" text-green-500 bold">Manage Campaigns</span>
						</a>
					</div>
					<div>
						<a href="/templatemaker">
							<span>Sheet creator</span>
						</a>
					</div>
				</div>
			</div>
			<div className="grid gap-4  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 justify-items-center">
				<div className="ring-2 ring-yellow-500 p-2 rounded-md bg-gray-700">
					<div className="flex">
						<Element save={createElement} placeholder="New Character" />
						<div className="w-10"></div>
					</div>
					<select
						name="character sheet"
						value={sheet}
						onChange={(e) => {
							console.log(JSON.stringify(e.target.value))
							setSheet(e.target.value)
						}}
					>
						<option value={-1}>none</option>
						{templates &&
							templates.map((sheet, index) => (
								<option value={index}>{sheet.name}</option>
							))}
					</select>
				</div>
				{characters.map((scene, index) => (
					<div
						className="flex ring-2 ring-yellow-500 p-2 rounded-md w-min bg-gray-700"
						key={`scene-${index}`}
					>
						<Element entry={scene} save={createElement} />
						<div className="w-10 pl-2">
							<button onClick={() => setRemove(scene._id)}>
								<svg
									className="h-8 w-8 text-gray-500 hover:text-red-700"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									{" "}
									<polyline points="3 6 5 6 21 6" />{" "}
									<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />{" "}
									<line x1="10" y1="11" x2="10" y2="17" />{" "}
									<line x1="14" y1="11" x2="14" y2="17" />
								</svg>
							</button>
							<div
								className={`${
									remove === scene._id
										? "fixed top-0 left-0 h-screen w-screen bg-grey-500 flex justify-center items-center bg-opacity-60"
										: "hidden"
								} `}
							>
								<div
									className={`bg-gray-900 w-5/6 h-20 rounded-lg p-2 flex flex-col`}
								>
									<div className="flex flex-row justify-between items-center border-t-2 border-b-2 border-yellow-400 mb-2 py-2">
										<button
											className="bg-green-800 py-1 px-10 rounded-lg hover:bg-green-500"
											onClick={() => {
												console.log("hey")
												setRemove("")
											}}
										>
											I CHANGED IDEA
										</button>
										<strong>Are you sure?</strong>
										<button
											className="bg-red-800 py-1 px-10 rounded-lg hover:bg-red-500"
											onClick={() => del(scene._id)}
										>
											DELETE CHARACTER
										</button>
									</div>
								</div>
							</div>
							<a
								href={`/Character/${scene._id}`}
								className="h-8 w-8  hover:bg-green-700 rounded-md"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 512 512"
									className="w-8 h-8"
								>
									<g class="" transform="translate(0,0)">
										<path
											d="M311.9 47.95c-17.6 0-34.6.7-50.7 2.43L244.6 93.5l-4.9-40.04c-2.5.46-5 .94-7.5 1.47-9.1 1.94-15.1 7.22-20.3 14.87-5.2 7.65-8.9 17.5-12.1 26.6C191 121.5 184 148 178.4 175c6 5.1 12 10.3 17.9 15.4l30.7-17.6 33.8 26.1 51.9-19.7 61 24.5-6.8 16.7-54.4-21.8-54.7 20.7-32.2-24.9-14.9 8.5c19.6 17.3 38.6 34.4 56.5 51.2l14-6.4 33.9 16.1 31.2-13.1 24.2 23.3-12.4 13-15.8-15.1-27.6 11.7-33-15.8c6.9 6.7 13.6 13.2 20.1 19.7l1.7 1.8 19.5 76.3-7.8-5.7-53 .4-38.1-17.8-42.4 14.6-5.8-17 49.2-17 41.1 19.2 24.7-.2-70.7-51.7c-19.7 4.6-39.4 2.8-58.1-3.7-4.2 44.4-5.9 85.7-7 118.7-.4 10.7 2.7 23 7.5 32.5 4.9 9.5 11.7 15.4 15 16.1 5.2 1.2 19 3.2 37.7 5.1l12.4-39 19.1 41.7c16.7 1.2 35 2 53.5 2.2 28.2.3 57.1-.9 82-4.7 15.8-2.3 29.6-6 40.7-10.4-11.8-5.1-21.6-10.6-29.1-16.6-11.1-8.9-18.2-19.3-17.3-30.9v.2c5.4-96.4 10.8-188.8 30.3-286l.1-.4.1-.4c5.3-17.9 17.9-39.86 36.1-55.83-13.9-2.06-28.6-4-43.7-5.66l-22.3 25.3-2.2-27.7c-19-1.64-38.4-2.71-57.4-2.92h-5.7zm148.5 20.44c-4.7 3.69-9.2 8.03-13.3 12.73 12.1 8.18 21.4 23.38 21.8 36.98.3 7.8-1.9 14.9-7.7 21.4-5.8 6.4-15.6 12.4-31.6 15.8l3.8 17.6c18.6-4 32.3-11.5 41.2-21.4 9-9.9 12.7-22.2 12.3-34-.6-19.3-11.1-37.59-26.5-49.11zM25.44 71.91c-.24 1.61-.38 3.43-.38 5.62.1 7.69 2.03 18.17 5.83 30.17 3.41 10.7 8.27 22.5 14.35 34.8 10.63-5.3 20.59-11 28.41-18.1-4.42 12.5-10.15 24.7-18.6 36.5 4.14 7.2 8.63 14.4 13.45 21.5 10.64-5.3 20.72-13 29.52-26.1-3.3 16-8.47 30.6-18.27 41.8 6.53 8.5 13.5 16.8 20.75 24.5 8.7-9.3 15.6-21 20.7-34.9 3.8 18.5 2.6 35.3-5.7 49.4 8 7.2 16.3 13.7 24.8 19.1 6.1-14 8.9-30.6 8.5-49.7 9.2 23.7 11.3 42.9 9.6 59.5 20.2 9.2 40.8 12 61.3 6.1l4.2-1.3 69.3 50.6-5.9-22.8c-73-72.8-175.4-156.7-261.86-226.69zM312.8 123.9l33.2 13.8 31.3-9.9 5.4 17.2-37.5 11.9-33.6-14-28.8 8.1-4.8-17.4zm107.3 236.2c-.7 0-1.3.1-2 .1-3.5.1-7.2.5-11.1 1.3l3.4 17.6c12.2-2.3 20-.4 24.5 2.5 4.4 2.9 6.3 6.8 6.4 12.5.1 9.3-7 23-23.3 32.5 5.4 2.9 11.9 5.9 19.3 8.7 14.4-11.6 22.1-26.8 22-41.4-.1-10.7-5.2-21.2-14.6-27.4-6.7-4.3-15-6.5-24.6-6.4z"
											fill="#fff"
											fillOpacity="1"
										></path>
									</g>
								</svg>
							</a>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default Scenes
