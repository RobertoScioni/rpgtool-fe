const MicroElement = (props) => {
	return (
		<div
			className="h-20  relative bg-gray-400 m-1 text-indigo-200 ring-1 ring-gray-100 rounded-sm bold text-center cursor-pointer overflow-clip"
			onClick={(e) => {
				if (props.action) props.action(props.entry)
			}}
		>
			<div className="h-20 w-20 relative bg-gray-400 flex justify-center">
				<img
					src={
						props.entry.imageUrl ||
						"https://res.cloudinary.com/ratanax/image/upload/v1616546238/rpgTool/scenes/ttlrrin7qj3visuxtxyh.jpg"
					}
					className="object-scale-down max-w-full max-h-full p-2"
					alt="avatar"
				></img>
			</div>
			<div className="absolute inset-x-0 mx-auto -mt-12">
				{props.entry.name}
			</div>
		</div>
	)
}

export default MicroElement
