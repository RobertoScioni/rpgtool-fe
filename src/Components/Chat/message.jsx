const Message = (props) => {
	let element = props.element
	let mine = element.sender._id === localStorage.getItem("id") ? true : false
	let ooc = element.as.hasOwnProperty("characters")
	let pm = element.hasOwnProperty("toPlayers")
	let wisper = element.toCharacters.length !== 0
	return (
		<div
			className={`m-1 p-2  flex border-black flex-col ${
				mine ? "self-end" : "self-start"
			} ${ooc ? "rounded-xl bg-indigo-100 " : "bg-blue-300 border-2"} ${
				pm ? "border-dashed border-red-700 border-4" : ""
			}`}
		>
			<div className="font-bold underline mb-2">
				{pm ? <b>PM: </b> : ""}
				{element.sender.name}
				{ooc ? (
					<span title="out of character"> ooc</span>
				) : (
					` as ${element.as.name}`
				)}
				{wisper
					? " to: " +
					  element.toCharacters.map((character) => `${character.name} `)
					: ""}
			</div>
			<div
				className={
					mine
						? "flex flex-row-reverse text-right max-w1/2"
						: "flex flex-row w-min max-w1/2"
				}
			>
				<div className={`w-20 ${ooc ? "rounded-full" : ""}`}>
					<img
						src={
							element.as.imageUrl ||
							"https://res.cloudinary.com/ratanax/image/upload/v1616546238/rpgTool/scenes/ttlrrin7qj3visuxtxyh.jpg"
						}
						className={`w-20 bg-gray-800 ${
							ooc ? "rounded-full bg-blue-300" : ""
						}`}
						alt="speaker face"
					/>
				</div>

				<div className="w-32 overflow-ellipsis break-words px-1 cursor-default">
					<div>
						{element.splitted.map((fragment) => (
							<span
								className={`${
									element.rollMap[fragment] ? "font-bold mx-1" : ""
								}`}
								title={element.rollMap[fragment] ? fragment : ""}
							>
								{element.rollMap[fragment] || fragment}
							</span>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Message
