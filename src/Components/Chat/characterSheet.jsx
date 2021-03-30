import { useState, useEffect } from "react"

/**
 * prints a character sheet
 * @param {*} props
 */
const CharacterSheet = (props) => {
	const [page, setPage] = useState("")
	const [pages, setPages] = useState({})
	useEffect(() => {
		//component did mount
		console.log("character sheet props", props)
		setPages(props.sheet)
		if (page === "") setPage(Object.keys(props.sheet)[0])
	}, [props, page])
	return (
		<div className="flex flex-col">
			<div id="pageSelector" className="flex border-b-4 ">
				{Object.keys(props.sheet).map((pageName) => (
					<div
						key={pageName}
						className={`mx-0.5 mb-0 rounded-t-md ${
							pageName !== page ? "bg-gray-500" : "bg-gray-100 text-gray-900"
						}`}
						onClick={() => setPage(pageName)}
					>
						{pageName}
					</div>
				))}
			</div>
			<div className="flex flex-wrap">
				{page &&
					pages[page].map((macro) => (
						<button
							className="bg-gray-500 p-2 m-1 rounded-md"
							onClick={() => {
								props.send(macro.macro)
							}}
						>
							{macro.name}
						</button>
					))}
			</div>
		</div>
	)
}
export default CharacterSheet
