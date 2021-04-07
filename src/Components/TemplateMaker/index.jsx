import { useState, useEffect } from "react"
import CharacterSheet from "../Chat/characterSheet"
import MicroElement from "../microElement"
import Element from "../element2"
import { Helmet } from "react-helmet"
const TemplateMaker = (props) => {
	const [editProfile, setEditProfile] = useState(false)
	const [reload, setReload] = useState(false)
	const [me, setMe] = useState({})
	const [TemplateName, setTemplateName] = useState()
	const [sheet, setSheet] = useState({ Counters: [], Pages: [] })
	const [pages, setPages] = useState({})
	const [page, setPage] = useState("")
	const [newPage, setNewPage] = useState("")
	//counter Stuff
	const [Counters, setCounters] = useState([])
	const [addCounter, setAddCounter] = useState(false)
	const [CounterName, setCounterName] = useState("")
	const [counterAbbreviation, setCounterAbbreviation] = useState("")
	const [min, setMin] = useState(0)
	const [max, setMax] = useState(10)

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
			setMe(response)
			setReload(!reload)
		} catch (error) {
			console.log(error)
		}
	}

	const appendCounter = () => {
		const counter = {
			name: CounterName,
			abbreviation: counterAbbreviation,
			min,
			value: min,
			max,
		}
		setCounters(Counters.concat(counter))
	}

	//new entry state
	const [name, setName] = useState("")
	const [value, setValue] = useState(false)
	const [description, setDescription] = useState("")
	const [editDescription, setEditDescription] = useState(false)
	const [macro, setMacro] = useState("")
	const [index, setIndex] = useState(-1)
	//edit existing Stuff
	const handleEdit = (page, Eindex) => {
		if (Eindex !== index) {
			const target = pages[page][Eindex]
			setPage(page)
			setName(target.name)
			setDescription(target.dsc)
			setValue(target.hasOwnProperty(value))
			setMacro(target.macro)
			setIndex(Eindex)
		} else {
			setIndex(-1)
		}
	}

	const clearForm = () => {
		setName("")
		setMacro("")
		setDescription("")
		setValue(false)
		setIndex(-1)
	}

	const Save = async () => {
		const template = JSON.stringify({ name: TemplateName, sheet })
		console.log(template)
		fetch(`${process.env.REACT_APP_BACKEND}/templates/`, {
			method: "POST",
			body: template,
			credentials: "include",
			headers: new Headers({
				"Content-Type": "application/json",
			}),
		})
	}

	const handleSave = () => {
		const update = { ...pages }
		const voice = { name }
		if (macro) voice.macro = macro
		if (description) voice.dsc = description
		if (value) voice.value = ""
		if (index < 0) {
			update[page].push(voice)
		} else {
			update[page][index] = voice
		}
		setPages(update)
		clearForm()
	}

	console.log("template maker")
	useEffect(() => {
		const tmp = { ...sheet }
		tmp.Pages = pages
		setSheet(tmp)
		setIndex(-1)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pages])

	useEffect(() => {
		const tmp = { ...sheet, Counters }
		setSheet(tmp)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [Counters])

	return (
		<div className="p-4 h-screen">
			<Helmet>
				<title>Template Maker</title>
				<meta
					name="template maker"
					content="Visual creator for character sheet templates"
				/>
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
					<p className=" text-yellow-500 bold">Character Sheet maker</p>
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
			</div>
			<div className="flex justify-between">
				<input
					type="text"
					placeholder="name your sheetTemplate"
					value={TemplateName}
					onChange={(e) => setTemplateName(e.target.value)}
				/>
				<button
					className=" bg-white hover:bg-green-400 rounded-full px-4"
					onClick={() => Save()}
				>
					save
				</button>
			</div>
			<div className=" mt-2 p-2 border-t-2 border-white">
				<div
					id="pager"
					className="flex flex-wrap border-white border-b-4 gap-0.5"
				>
					<form
						action="submit"
						onSubmit={(e) => {
							e.preventDefault()
							const newPages = { ...pages }
							newPages[newPage] = []
							setPages(newPages)
							setPage(newPage)
							setNewPage("")
						}}
					>
						<input
							className="mr-2 my-0.5 p-1"
							value={newPage}
							placeholder="name a page and press enter"
							onChange={(e) => {
								console.log("character entered")
								setNewPage(e.target.value)
							}}
						></input>
					</form>
					<div className="flex flex-wrap gap-0.5">
						{Object.keys(pages).map((pageName) => (
							<div
								className={` font-bold px-2 rounded-t-xl ${
									pageName === page
										? "text-red-500 bg-white"
										: "bg-red-500 text-white"
								}`}
								onClick={(e) => {
									setPage(pageName)
									setIndex(-1)
								}}
							>
								{pageName}
							</div>
						))}
					</div>
					<div className="flex-grow"></div>
					<div className="self-end flex flex-wrap gap-0.5">
						{Counters &&
							Counters.map((counter, index) => (
								<div
									key={counter.name}
									className="flex ml-2 my-1 ring-2 bg-green-500"
									title={counter.name}
								>
									<p className="font-bold pr-1">{counter.abbreviation}</p>
									<input
										type="number"
										min={counter.min}
										max={counter.max}
										className="w-8 text-gray-900 bg-gray-200 text-center"
									></input>
								</div>
							))}
						<button
							className="bg-gray-200 ml-4"
							onClick={() => setAddCounter(true)}
						>
							add Counter
						</button>
					</div>
				</div>
				<div id="Page">
					{page ? (
						<div>
							<div className="flex flex-wrap gap-2 p-2 text-center border-white border-b-4">
								<div className="ring-1 ring-white">
									<p className="mb-2 text-white">Name</p>
									<input
										type="text"
										value={name}
										onChange={(e) => setName(e.target.value)}
									/>
								</div>
								<div className="ring-1 ring-white">
									<p className="mb-2 text-white">Macro</p>
									<input
										type="text"
										value={macro}
										onChange={(e) => setMacro(e.target.value)}
									/>
								</div>
								<div className="ring-1 ring-white px-4">
									<p className=" text-white">Description</p>
									<button
										className="px-4 my-1 bg-red-500 text-white font-bold rounded-xl hover:bg-white hover:text-red-500"
										onClick={() => setEditDescription(true)}
									>
										edit
									</button>
								</div>
								<div className="ring-1 ring-white px-4 flex justify-center items-center gap-1">
									<span className=" text-white">Editable Value</span>
									<input
										type="checkbox"
										value={value}
										onChange={(e) => setValue(e.target.value)}
									/>
								</div>
								<button
									className="px-4 my-1 bg-green-500 text-white font-bold rounded-xl hover:bg-white hover:text-green-500"
									onClick={() => handleSave()}
								>
									{index < 0 ? "ADD TO PAGE" : "Confirm changes"}
								</button>
								<div
									className={`${
										editDescription
											? "fixed top-0 left-0 h-screen w-screen bg-indigo-400 flex justify-center items-center bg-opacity-60"
											: "hidden"
									} `}
								>
									<div
										className={`bg-indigo-900 w-5/6 h-5/6 rounded-lg p-2 flex flex-col`}
									>
										<div className="flex border-b-2 border-yellow-400 mb-2 pb-2">
											<strong className="flex-grow">EditDescription</strong>
											<svg
												className="h-8 w-8 text-red-500"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												onClick={() => setEditDescription(false)}
											>
												<circle cx="12" cy="12" r="10" />{" "}
												<line x1="15" y1="9" x2="9" y2="15" />{" "}
												<line x1="9" y1="9" x2="15" y2="15" />
											</svg>
										</div>

										<textarea
											value={description}
											onChange={(e) => setDescription(e.target.value)}
											placeholder="Description"
											className="resize-none h-full w-full bg-gray-200"
										></textarea>
									</div>
								</div>
								<div
									className={`${
										addCounter
											? "fixed top-0 left-0 h-screen w-screen bg-indigo-400 flex justify-center items-center bg-opacity-60"
											: "hidden"
									} `}
								>
									<div
										className={`bg-indigo-900 w-5/6 h-max rounded-lg p-2 flex flex-col`}
									>
										<div className="flex border-b-2 border-yellow-400 mb-2 pb-2">
											<strong className="flex-grow">AddCounter</strong>
											<svg
												className="h-8 w-8 text-red-500"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												onClick={() => setAddCounter(false)}
											>
												<circle cx="12" cy="12" r="10" />{" "}
												<line x1="15" y1="9" x2="9" y2="15" />{" "}
												<line x1="9" y1="9" x2="15" y2="15" />
											</svg>
										</div>
										<div className="flex flex-wrap">
											<input
												type="text"
												placeholder="Counter name"
												className=" ml-2 my-1 ring-2 "
												value={CounterName}
												onChange={(e) => setCounterName(e.target.value)}
											/>
											<input
												type="text"
												placeholder="Counter abbreviation"
												className=" ml-2 my-1 ring-2 "
												value={counterAbbreviation}
												onChange={(e) => setCounterAbbreviation(e.target.value)}
											/>

											<div className="flex ml-2 my-1 ring-2 bg-green-500">
												<p className="font-bold pr-1">MIN</p>
												<input
													type="number"
													max={max}
													className="w-8 text-gray-900 bg-gray-200 text-center"
													value={min}
													onChange={(e) => setMin(e.target.value)}
												></input>
											</div>
											<div className="flex ml-2 my-1 ring-2 bg-green-500">
												<p className="font-bold pr-1">MAX</p>
												<input
													type="number"
													min={min}
													className="w-8 text-gray-900 bg-gray-200 text-center"
													value={max}
													onChange={(e) => setMax(e.target.value)}
												></input>
											</div>
											<div className="flex-grow"></div>
											<button
												className=" bg-white rounded-md px-4 py-1 hover:bg-green-500"
												onClick={(e) => {
													appendCounter()
													setAddCounter(false)
												}}
											>
												add
											</button>
										</div>
									</div>
								</div>
							</div>
							<div name="preview" className="text-gray-300">
								<CharacterSheet
									sheet={sheet}
									edit={handleEdit}
									page={page}
									selected={index}
								/>
							</div>
						</div>
					) : (
						<div className="flex justify-center items-center">
							<p className="text-white">CREATE A PAGE FIRST</p>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default TemplateMaker
