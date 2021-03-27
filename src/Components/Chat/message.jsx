const Message = (props) => {
	let element = props.element
	return (
		<div
			className={`m-1 p-2 w-min max-w1/2 flex border-black  ${
				element.sender._id === localStorage.getItem("id")
					? "self-end flex-row-reverse text-right"
					: "self-start flex-row"
			} ${
				element.as.hasOwnProperty("characters")
					? "rounded-xl bg-indigo-100 "
					: "bg-blue-300 border-2"
			}`}
			//key={`message-${index}`}
		>
			<div
				className={`w-20 ${
					element.as.hasOwnProperty("characters") ? "rounded-full" : ""
				}`}
			>
				<img
					src={
						element.as.imageUrl ||
						"https://res.cloudinary.com/ratanax/image/upload/v1616546238/rpgTool/scenes/ttlrrin7qj3visuxtxyh.jpg"
					}
					className={`w-20 bg-gray-800 ${
						element.as.hasOwnProperty("characters")
							? "rounded-full bg-blue-300"
							: ""
					}`}
					alt="speaker face"
				/>
			</div>

			<div className="w-64 overflow-ellipsis break-words px-1 cursor-default">
				<div className=" font-bold underline">
					{element.sender.name}
					{element.as.hasOwnProperty("characters")
						? ""
						: ` as ${element.as.name}`}
				</div>
				<div>
					{element.splitted.map((fragment) => (
						<span
							className={`${element.rollMap[fragment] ? "font-bold mx-1" : ""}`}
							title={element.rollMap[fragment] ? fragment : ""}
						>
							{element.rollMap[fragment] || fragment}
						</span>
					))}
				</div>
			</div>
		</div>
	)
}

export default Message
