const MicroElement = (props) => {
	return (
		<div className="h-20 w-auto relative">
			<img
				src={
					props.entry.imageUrl ||
					"https://res.cloudinary.com/ratanax/image/upload/v1616546238/rpgTool/scenes/ttlrrin7qj3visuxtxyh.jpg"
				}
				className="object-scale-down max-w-full max-h-full p-2"
			></img>
			<div className="absolute inset-x-0 min-w-full min-h-full mx-auto mx-auto -mt-12">
				{props.entry.userName}
			</div>
		</div>
	)
}

export default MicroElement
