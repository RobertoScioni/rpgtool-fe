import { useState, useEffect } from "react"

/**
 * prints a character sheet
 * @param {*} props
 */
const CharacterSheet = (props) => {
	const [page, setPage] = useState("")
	const [pages, setPages] = useState({})
	const [counters, setCounter] = useState([])
	const [dsc, setDsc] = useState(false)
	const handleCounter = (index, value) => {
		const aux = [...counters]
		aux[index].value = value
		setCounter(aux)
	}
	const handlePageField = (page, index, value) => {
		const aux = { ...pages }
		aux[page][index].value = value
		console.log("###", aux, pages, page)
		setPages(aux)
	}

	useEffect(() => {
		//component did mount
		//must cycle the Counters to prepare the state for them
		setCounter(props.sheet.Counters)
		console.log("character sheet props", props)
		setPages(props.sheet.Pages)
		if (props.page) setPage(props.page)
		if (page === "") setPage(Object.keys(props.sheet.Pages)[0])
	}, [props, page])
	return (
		<div className="flex flex-col h-full">
			{!props.page && (
				<div id="pageSelector" className="flex border-b-4">
					{Object.keys(props.sheet.Pages).map((pageName) => (
						<div
							key={pageName}
							className={`mr-1 px-1 mt-2 mb-0 rounded-t-md ${
								pageName !== page ? "bg-gray-500" : "bg-gray-300 text-gray-900"
							}`}
							onClick={() => setPage(pageName)}
						>
							{pageName}
						</div>
					))}
					<div className="flex-grow"></div>
					{counters &&
						counters.map((counter, index) => (
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
									value={counters[index].value}
									onChange={(e) => handleCounter(index, e.target.value)}
								></input>
							</div>
						))}
				</div>
			)}
			<div className="flex-grow py-2 h-5/6 flex flex-col flex-wrap gap-1">
				{pages[page] &&
					pages[page].map((macro, index) => {
						return (
							<div
								className={
									index === props.selected &&
									"border-4 border-yellow-600 rounded-md"
								}
							>
								{macro.hasOwnProperty("dsc") && (
									<span
										className=" mx-2 rounded-full text-black bg-blue-400 hover:bg-blue-700 px-2 hover:text-yellow-500 cursor-pointer font-bold"
										onClick={() => setDsc(macro)}
									>
										?
									</span>
								)}
								{macro.hasOwnProperty("macro") && (
									<button
										className="bg-gray-500 p-2 m-1 rounded-md"
										onClick={() => {
											if (props.send)
												props.send(macro.name + ": " + macro.macro)
										}}
										key={`macro-${macro.name}-${index}`}
									>
										Roll
									</button>
								)}
								{macro.hasOwnProperty("value") ? (
									<input
										className="text-gray-900 p-0.5 m-1 w-1/2"
										placeholder={pages[page][index].name}
										title={pages[page][index].name}
										value={pages[page][index].value}
										onChange={(e) =>
											handlePageField(page, index, e.target.value)
										}
									></input>
								) : (
									<span className=" underline">{macro.name}</span>
								)}
								{props.edit && (
									<button
										onClick={() => {
											props.edit(page, index)
										}}
										className="mx-1 px-1.5 text-justify align-middle rounded-full bg-gray-500"
									>
										...
									</button>
								)}
								{props.delete && (
									<button
										onClick={() => {
											props.delete(page, index)
										}}
										className="mx-1 px-1.5 text-justify align-middle rounded-full bg-gray-500 hover:text-red-500"
									>
										x
									</button>
								)}
							</div>
						)
					})}
			</div>
			<div
				onClick={() => setDsc(false)}
				className={`flex flex-col justify-center items-center ${
					dsc
						? "bg-gray-400 bg-opacity-60 fixed top-0 left-0 h-screen w-screen"
						: "hidden"
				}`}
			>
				<div className="bg-gray-900  w-1/2 px-4 rounded-lg flex flex-col pointer-events-none">
					<div
						className="border-b-2 h-6 border-yellow-400 text-center text-red-600"
						//onClick={() => setDsc(false)}
					>
						CLOSE
					</div>
					<p className="pt-1.5 font-bold">{dsc.name}</p>
					<p className="py-1.5">{dsc.dsc}</p>
					<div className="border-t-2 h-6 border-yellow-400"></div>
				</div>
			</div>
		</div>
	)
}
export default CharacterSheet
