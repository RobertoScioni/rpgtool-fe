const MicroElement = (props) => {
	return (
		<div
			className="h-20 w-20 relative bg-gray-400 m-1 text-indigo-200 ring-1 ring-gray-100 rounded-sm bold text-center cursor-pointer overflow-clip"
			onClick={(e) => {
				if (props.action) props.action(props.entry)
			}}
		>
			<div className="h-20 w-20 relative bg-gray-400 flex justify-center items-center">
				<img
					src={
						props.entry.imageUrl ||
						"https://res.cloudinary.com/ratanax/image/upload/v1616546238/rpgTool/scenes/ttlrrin7qj3visuxtxyh.jpg"
					}
					className="object-scale-down max-w-full max-h-full p-2"
					alt="avatar"
				></img>
			</div>
			<div className="absolute inset-x-0 mx-auto -mt-12 text-overlay">
				{props.entry.name}
			</div>
			{props.selected && (
				<div className="absolute top-0 right-0 rounded-full bg-gray-500 p-1">
					<svg
						className="h-5 w-5 text-green-300"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<polyline points="20 6 9 17 4 12" />
					</svg>
				</div>
			)}
		</div>
	)
}

export default MicroElement
