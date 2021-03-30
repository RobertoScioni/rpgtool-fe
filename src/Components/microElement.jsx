const MicroElement = (props) => {
	return (
		<div
			className="h-20 w-20 relative bg-gray-400 m-1 text-indigo-200 bold text-center cursor-pointer"
			onClick={(e) => {
				if (props.action) props.action(props.entry)
			}}
		>
			<div className="h-20 w-20 relative bg-gray-400 flex justify-items-center align-middle">
				<img
					src={
						props.entry.imageUrl ||
						"https://res.cloudinary.com/ratanax/image/upload/v1616546238/rpgTool/scenes/ttlrrin7qj3visuxtxyh.jpg"
					}
					className="object-scale-down max-w-full max-h-full p-2"
					alt="avatar"
				></img>
			</div>
			<div className="absolute inset-x-0 min-w-full min-h-full mx-auto mx-auto -mt-12">
				{props.entry.name}
			</div>
		</div>
	)
}

export default MicroElement
