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
import * as Buttons from "../Ux"
import Element from "../element2"
import MicroElement from "../microElement"
import * as fetches from "../fetches"
import { useHistory } from "react-router-dom"

const Manager = (props) => {
	const [campaigns, setCampaigns] = useState([])
	const [campaign, setCampaign] = useState({})
	const [templates, setTemplates] = useState([])
	const [me, setMe] = useState({})
	const [editProfile, setEditProfile] = useState(false)
	const [reload, setReload] = useState(false)
	const [remove, setRemove] = useState("")
	const { campaignId } = useParams()
	const mode = props.mode
	const history = useHistory()

	const del = async (entry /* _id */) => {
		let response = await fetches.remove(entry, mode)
		console.log(response)
		setCampaigns(campaigns.filter((element) => element._id !== entry._id))
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

	const createElement = async (entry, mode) => {
		console.log("entry ", entry)
		entry = mode === "campaigns" ? { ...entry, members: [{ ...me }] } : entry
		console.log("entry modified", entry)
		try {
			let newOne = await fetches.createOrUpdate(entry, mode)
			if (!entry._id) {
				setCampaigns(campaigns.concat(newOne))
			}
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		const get = async () => {
			//get the user i think i'll move this stuff to local storage to be fair
			const me = await fetches.get("users/me")
			setMe(me)
			//get the elements to show
			let address = campaignId ? "campaigns/" + campaignId : mode
			let elements = await fetches.get(address)
			if (campaignId) {
				console.log("---we should be rendering scenes ---")
				setCampaign(elements)
				elements = elements.scenes
			}
			setCampaigns(elements)
			console.log(campaigns)
			if (mode === "characters") {
				//get character sheet templates
				const response = await fetches.get("templates")
				setTemplates(response)
			}
		}
		console.log("where am i", mode, campaignId)
		get()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

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
						<a
							className=" self-end"
							href={
								mode === "characters" || mode === "scenes"
									? "/campaigns"
									: "/characters"
							}
						>
							<span className=" text-green-500 bold">
								Manage{" "}
								{mode === "characters" || mode === "scenes"
									? "Campaigns"
									: "Characters"}
							</span>
						</a>
					</div>
					<div>
						<a href="/templatemaker">
							<span>Sheet creator</span>
						</a>
					</div>
				</div>
			</div>

			<div className=" ml-4 pb-4 flex flex-wrap justify-items-center gap-4">
				<Element
					save={createElement}
					mode={mode}
					entry={campaignId ? { campaign } : "undefined"}
					placeholder="New Campaign"
					templates={templates}
				/>
				{campaigns &&
					campaigns.length > 0 &&
					campaigns.map((element, index) => (
						<Element
							entry={element}
							mode={mode}
							save={createElement}
							key={`element-${index}`}
						>
							<Buttons.RemoveEntry onClick={() => setRemove(element)} />
							{(mode === "campaigns" || mode === "scenes") && (
								<>
									<Buttons.OpenGame
										href={`/chat${
											mode === "scenes" ? "/" + campaign.name : ""
										}/${element._id}`}
									/>
									<Buttons.ManagePlayers
										href={`/${
											mode === "scenes" ? "scene/" + campaign._id : "campaign"
										}/${element._id}`}
									/>
									{mode === "campaigns" && (
										<Buttons.ManageScenes href={`/scenes/${element._id}`} />
									)}
								</>
							)}
							{element.hasOwnProperty("sheet") && (
								<Buttons.CharacterSheet
									onClick={() => history.push(`/character/${element._id}`)}
								/>
							)}
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
