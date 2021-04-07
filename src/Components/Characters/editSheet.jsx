/**
 * feture list:
 * list characters
 * create a scene
 * edit a scene
 * add players to a scene
 * add characters to the scene may need a player character list component
 */
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Element from "../element2"
import MicroElement from "../microElement"

const getCharacter = async (character) => {
	let response = await fetch(
		`${process.env.REACT_APP_BACKEND}/characters/${character}`,
		{
			method: "GET",
			credentials: "include",
			headers: new Headers({
				"Content-Type": "application/json",
			}),
		}
	)
	response = await response.json()
	console.log("character query response", response)
	return { ...response }
}

const EditSheet = (props) => {
	const [character, setCharacter] = useState({})
	const [reload, setReload] = useState(false)
	const [me, setMe] = useState({})
	const [editProfile, setEditProfile] = useState(false)
	const [page, setPage] = useState("")
	const [description, setDescription] = useState(false)
	const { characterId } = useParams()

	const pushToPage = (page, element) => {
		console.log("push", element, "into", page)
		const simulacra = { ...character }
		simulacra.sheet.Pages[page].push(element)
		setCharacter(simulacra)
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

	const createElement = async (entry) => {
		console.log(
			"********************************************************************************"
		)
		console.log("entry ", entry)
		try {
			let response = await fetch(
				`${process.env.REACT_APP_BACKEND}/characters/${
					entry._id ? entry._id : ""
				}`,
				{
					method: `${entry._id ? "PUT" : "POST"}`,
					credentials: "include",
					body: JSON.stringify(entry),
					headers: new Headers({
						"Content-Type": "application/json",
					}),
				}
			)
			response = await response.json()
			console.log(response)
			setReload(!reload)
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		const toState = async () => {
			let aux = await getCharacter(characterId)
			setCharacter({ ...aux })
			setPage(Object.keys(aux.sheet.Pages)[0])
		}
		toState()
		getMe()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props, reload])

	const handleSheet = (fields, value) => {
		let aux = { ...character }
		let field = aux.sheet
		let target = fields.pop()
		console.log("changing", fields, "target", target)
		for (let index = 0; index < fields.length; index++) {
			field = field[fields[index]]
		}

		console.log("original", field[target])
		field[target] = value
		console.log("modified", field[target])
		setCharacter(aux)
	}

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
				<div className="flex justify-center items-center">
					<button
						className="bg-yellow-500 px-5 py-1 rounded-full hover:bg-green-400 font-bold"
						onClick={(e) => createElement(character)}
					>
						SAVE CHANGES
					</button>
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
			<div>
				<div id="Counters" className="flex border-b-4">
					{character.sheet &&
						character.sheet.Counters &&
						character.sheet.Counters.map((counter, index) => (
							<div
								key={counter.name}
								className="px-3 m-2 text-center border-2 border-gray-100"
							>
								<p className="font-bold text-gray-100">{counter.name}</p>
								<div
									className="flex ml-2 my-1 ring-2 bg-green-500"
									title={counter.name}
								>
									<p className="font-bold pr-1">min</p>
									<input
										type="number"
										max={counter.max}
										className="w-8 text-gray-900 bg-gray-200 text-center"
										value={character.sheet.Counters[index].min}
										onChange={(e) =>
											handleSheet(["Counters", index, "min"], e.target.value)
										}
									></input>
									<p className="font-bold pr-1">value</p>
									<input
										type="number"
										min={counter.min}
										max={counter.max}
										className="w-8 text-gray-900 bg-gray-200 text-center"
										value={character.sheet.Counters[index].value}
										onChange={(e) =>
											handleSheet(["Counters", index, "value"], e.target.value)
										}
									></input>
									<p className="font-bold pr-1">max</p>
									<input
										type="number"
										min={counter.min}
										className="w-8 text-gray-900 bg-gray-200 text-center"
										value={character.sheet.Counters[index].max}
										onChange={(e) =>
											handleSheet(["Counters", index, "max"], e.target.value)
										}
									></input>
								</div>
							</div>
						))}
				</div>
				<div id="pageSelector" className="flex border-b-4">
					{character.sheet &&
						Object.keys(character.sheet.Pages).map((pageName) => (
							<div
								key={pageName}
								className={`mr-1 px-1 mt-2 mb-0 rounded-t-md ${
									pageName !== page
										? "bg-gray-500"
										: "bg-gray-300 text-gray-900"
								}`}
								onClick={() => setPage(pageName)}
							>
								{pageName}
							</div>
						))}
					<div className="flex-grow"></div>
				</div>
				<div id="page-container">
					<div className="h-full py-5 flex flex-col flex-wrap gap-1">
						{page &&
							character.sheet.Pages[page].map((macro, index) => {
								return (
									<div
										key={`macro-${index}`}
										className="p-2 ring-1 ring-gray-400 m-1 flex justify-center flex-wrap gap-4"
									>
										<input
											className="text-gray-900"
											value={character.sheet.Pages[page][index].name}
											onChange={(e) => {
												handleSheet(
													["Pages", page, index, "name"],
													e.target.value
												)
											}}
										></input>
										{macro.hasOwnProperty("macro") && (
											<>
												<span className=" text-yellow-400 ml-4 -mr-2">
													macro
												</span>
												<input
													className="text-gray-900 ring-4 ring-yellow-400"
													value={character.sheet.Pages[page][index].macro}
													onChange={(e) => {
														handleSheet(
															["Pages", page, index, "macro"],
															e.target.value
														)
													}}
												></input>
											</>
										)}
										{macro.hasOwnProperty("value") && (
											<>
												<span className=" text-green-400 ml-4 mr-2">value</span>
												<input
													className="text-gray-900 ring-4 ring-green-400"
													value={character.sheet.Pages[page][index].value}
													onChange={(e) => {
														handleSheet(
															["Pages", page, index, "value"],
															e.target.value
														)
													}}
												></input>
											</>
										)}
										{macro.hasOwnProperty("dsc") && (
											<>
												<button
													className="text-green-400 ring-2 py-0.5 px-4 rounded-full hover:bg-white hover:text-gray-900  ring-green-400 ml-5"
													value={character.sheet.Pages[page][index].value}
													onClick={(e) => setDescription(index)}
													onChange={(e) => {
														handleSheet(
															["Pages", page, index, "value"],
															e.target.value
														)
													}}
												>
													description
												</button>
												<div
													className={`${
														description === index
															? "fixed top-0 left-0 h-screen w-screen bg-indigo-400 flex justify-center items-center bg-opacity-60"
															: "hidden"
													} `}
												>
													<div
														className={`bg-indigo-900 w-5/6 h-5/6 rounded-lg p-2 flex flex-col`}
													>
														<div className="flex border-b-2 border-yellow-400 mb-2 pb-2">
															<strong className="flex-grow">
																{macro.name}
															</strong>
															<svg
																className="h-8 w-8 text-red-500"
																viewBox="0 0 24 24"
																fill="none"
																stroke="currentColor"
																strokeWidth="2"
																strokeLinecap="round"
																strokeLinejoin="round"
																onClick={() => setDescription(false)}
															>
																<circle cx="12" cy="12" r="10" />{" "}
																<line x1="15" y1="9" x2="9" y2="15" />{" "}
																<line x1="9" y1="9" x2="15" y2="15" />
															</svg>
														</div>

														<textarea
															placeholder="Description"
															className="resize-none h-full w-full bg-gray-200"
														></textarea>
													</div>
												</div>
											</>
										)}
										<div className="hover:text-yellow-400 text-gray-200">
											<button
												onClick={(e) => {
													pushToPage(page, { ...macro })
												}}
											>
												Duplicate
											</button>
										</div>
									</div>
								)
							})}
					</div>
				</div>
			</div>
		</div>
	)
}

export default EditSheet
