/**
 * feture list:
 * list campaigns
 * create a campaign
 * edit a campaign
 * add players to a campaign
 * add characters to the campaign may need a player character list component
 */
import { useState, useEffect } from "react"
import Element from "../element"
import MicroElement from "../microElement"
const Campaigns = () => {
	const [campaigns, setCampaigns] = useState([])
	const [me, setMe] = useState({})
	const [editProfile, setEditProfile] = useState(false)
	const [reload, setReload] = useState(false)

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
	const del = (id) => {}
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
		let response = await fetch(`${process.env.REACT_APP_BACKEND}/campaigns/`, {
			method: "GET",
			credentials: "include",
			headers: new Headers({
				"Content-Type": "application/json",
			}),
		})
		response = await response.json()
		setCampaigns([...response])
		console.log("campaigns", campaigns)
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
				`${process.env.REACT_APP_BACKEND}/campaigns/${
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
				`${process.env.REACT_APP_BACKEND}/campaigns/imageUpload/${id}`,
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
		getMe()
		getElements()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		getMe()
		getElements()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reload])
	return (
		<div className="bg-gray-900 h-full ">
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
					<p className=" text-yellow-500 bold">My Campaigns Manager</p>
				</div>

				<div className="p-2">
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
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 justify-items-center">
				<div className="flex ring-2 ring-yellow-500 p-2 rounded-md bg-gray-700">
					<Element save={createElement} placeholder="New Campaign" />
					<div className="w-10"></div>
				</div>

				{campaigns.map((campaign, index) => (
					<div
						className="flex ring-2 ring-yellow-500 p-2 rounded-md w-min bg-gray-700"
						key={`campaign-${index}`}
					>
						<Element entry={campaign} save={createElement} />
						<div className=" ml-1">
							<div>
								<a href={`/chat/${campaign._id}`}>
									<svg
										className="h-8 w-8 text-green-500"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										title="Start the Campaign"
									>
										<polygon points="5 3 19 12 5 21 5 3" />
									</svg>
								</a>
							</div>
							<div>
								<a href={`/campaign/${campaign._id}`}>
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
							<div>
								<a href={`/scenes/${campaign._id}`}>
									<svg
										className="h-8 w-8 text-green-500"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										{" "}
										<rect
											x="2"
											y="2"
											width="20"
											height="20"
											rx="2.18"
											ry="2.18"
										/>{" "}
										<line x1="7" y1="2" x2="7" y2="22" />{" "}
										<line x1="17" y1="2" x2="17" y2="22" />{" "}
										<line x1="2" y1="12" x2="22" y2="12" />{" "}
										<line x1="2" y1="7" x2="7" y2="7" />{" "}
										<line x1="2" y1="17" x2="7" y2="17" />{" "}
										<line x1="17" y1="17" x2="22" y2="17" />{" "}
										<line x1="17" y1="7" x2="22" y2="7" />
									</svg>
								</a>
							</div>
							<button onClick={del(campaign._id)}>
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
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default Campaigns
