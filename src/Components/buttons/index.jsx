const UxButton = (props) => {
	return (
		<button onClick={props.onClick} title={props.title}>
			<svg
				className="h-8 w-8 text-green-500 hover:text-white"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				{props.children}
			</svg>
		</button>
	)
}

const RemoveEntry = (props) => {
	return (
		<UxButton title="startGame" onClick={props.onClick}>
			<polyline points="3 6 5 6 21 6" />
			<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
			<line x1="10" y1="11" x2="10" y2="17" />
			<line x1="14" y1="11" x2="14" y2="17" />
		</UxButton>
	)
}

const OpenGame = (props) => {
	return (
		<UxButton title="startGame" onClick={props.onClick}>
			<polygon points="5 3 19 12 5 21 5 3" />
		</UxButton>
	)
}

const ManagePlayers = (props) => {
	return (
		<UxButton title="startGame" onClick={props.onClick}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
			/>
		</UxButton>
	)
}

const ManageScenes = (props) => {
	return (
		<UxButton title="Manage Scenes" onClick={props.onClick}>
			<rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
			<line x1="7" y1="2" x2="7" y2="22" />
			<line x1="17" y1="2" x2="17" y2="22" />
			<line x1="2" y1="12" x2="22" y2="12" />
			<line x1="2" y1="7" x2="7" y2="7" />
			<line x1="2" y1="17" x2="7" y2="17" />
			<line x1="17" y1="17" x2="22" y2="17" />
			<line x1="17" y1="7" x2="22" y2="7" />
		</UxButton>
	)
}

export { OpenGame, ManageScenes, ManagePlayers, RemoveEntry }
