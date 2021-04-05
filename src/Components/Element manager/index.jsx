/**
 * feture list:
 * Create/List/Edit/Route Campaigns/Scenes/Characters
 *
 *
 *
 *
 */
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Helmet } from "react-helmet"
import * as Buttons from "../buttons"
import Element from "../element2"
import MicroElement from "../microElement"
import * as fetches from "../fetches"
import { useHistory } from "react-router-dom"

const Manager = (props) => {
	const [campaigns, setCampaigns] = useState([])
	const [me, setMe] = useState({})
	const [editProfile, setEditProfile] = useState(false)
	const [reload, setReload] = useState(false)
	const [remove, setRemove] = useState("")
	//const [mode, setMode] = useState(useLocation())
	const { mode, campaignId } = useParams()
	const history = useHistory()

	const getMe = async () => {
		let response = await fetch(`${process.env.REACT_APP_BACKEND}/users/me`, {
			method: "GET",
			credentials: "include",
			headers: new Headers({
				"Content-Type": "application/json",
			}),
		})
		response = await response.json()
		console.log("#me", me)
		return response
	}

	const del = async (_id) => {
		let response = await fetch(
			`${process.env.REACT_APP_BACKEND}/${mode}/${_id}`,
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
		let response = await fetch(
			`${process.env.REACT_APP_BACKEND}/${mode}${
				props.campaignId ? "/" + props.campaignId : ""
			}`,
			{
				method: "GET",
				credentials: "include",
				headers: new Headers({
					"Content-Type": "application/json",
				}),
			}
		)
		response = await response.json()
		return response
	}

	const createElement = async (entry) => {
		console.log(
			"********************************************************************************"
		)
		console.log("entry ", entry)
		try {
			if (entry.file.length === 0) {
				throw new Error("picture is mandatory")
			}
			let id = await fetch(
				`${process.env.REACT_APP_BACKEND}/${mode}/${
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
				`${process.env.REACT_APP_BACKEND}/${mode}/imageUpload/${id}`,
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
		const get = async () => {
			const me = await getMe()
			setMe(me)
			let elements = await fetches.get(
				campaignId ? mode + "/" + campaignId : mode
			)
			console.log("#######", elements)
			setCampaigns(elements)
		}
		console.log("where am i", mode, campaignId)
		get()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		getMe()
		getElements()

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reload])
	return (
		<div className="bg-gray-900 h-full ">
			<Helmet>
				<title>Argo/{mode}</title>
				<meta name={mode} content="" />
			</Helmet>
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
					<p className=" text-yellow-500 bold">My {mode} Manager</p>
				</div>

				<div className="p-2">
					<div>
						<a className=" self-end" href="/Characters">
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
							<span className=" text-green-500 bold">Manage Characters</span>
						</a>
					</div>
					<div>
						<a href="/templatemaker">
							<span>Sheet creator</span>
						</a>
					</div>
				</div>
			</div>

			<div className=" ml-4 flex flex-wrap justify-items-center gap-4">
				<Element save={createElement} placeholder="New Campaign" />
				{campaigns.map((campaign, index) => (
					<Element
						entry={campaign}
						save={createElement}
						key={`campaign-${index}`}
					>
						<Buttons.RemoveEntry onClick={() => setRemove(campaign._id)} />
						{(mode === "campaigns" || mode === "scene") && (
							<>
								<Buttons.OpenGame
									onClick={() => history.push(`/chat/${campaign._id}`)}
								/>
								<Buttons.ManagePlayers
									onClick={() => history.push(`/campaign/${campaign._id}`)}
								/>
							</>
						)}

						<Buttons.ManageScenes
							onClick={() => history.push(`/scenes/${campaign._id}`)}
						/>
					</Element>
				))}

				<div
					className={`${
						remove
							? "fixed top-0 left-0 h-screen w-screen bg-gray-700 flex justify-center items-center bg-opacity-60"
							: "hidden"
					} `}
				>
					<div
						className={`bg-gray-900 w-5/6 h-20 rounded-lg p-2 flex flex-col justify-items-center shadow-2xl`}
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
							<strong className="text-white">Are you sure?</strong>
							<button
								className="bg-red-800 py-1 px-10 rounded-lg hover:bg-red-500"
								onClick={() => del(remove)}
							>
								DELETE {mode.toUpperCase()}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Manager
