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
	const [me, setMe] = useState({})
	const [editProfile, setEditProfile] = useState(false)
	const id = props._id ? props._id : localStorage.getItem("id")

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
				body: JSON.stringify({ name: entry.name, dsc: entry.dsc }),
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

	useEffect(
		(props) => {
			console.log(props ? props.params._id : localStorage.getItem("id"))
			getMe()
			getElements()
		},
		[props]
	)

	useEffect(() => {
		getMe()
		getElements()
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
					<p className=" text-yellow-500 bold">Character Manager</p>
				</div>

				<div>
					<p className=" text-center">NEW CHARACTER</p>
					<Element save={createElement} />
				</div>
				<div className="p-2">
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
			</div>
			<div className="grid gap-4  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 justify-items-center">
				{characters.map((scene, index) => (
					<div
						className="flex ring-2 ring-yellow-500 p-2 rounded-md w-min"
						key={`scene-${index}`}
					>
						<Element entry={scene} save={createElement} />
					</div>
				))}
			</div>
		</div>
	)
}

export default Scenes
