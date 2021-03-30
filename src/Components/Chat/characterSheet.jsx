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
		setPage(Object.keys(props.sheet)[0])
	}, [props])
	return (
		<div className="flex flex-col">
			<div id="pageSelector" className="flex">
				{Object.keys(props.sheet).map((pageName) => (
					<div
						key={pageName}
						className={`bg-gray-500 p-2 m-1 rounded-md`}
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
