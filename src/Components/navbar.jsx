import { useState, useEffect } from "react"
import * as fetches from "./fetches"
import Element from "./element"
const Navbar = (props) => {
	const [me, setME] = useState(false)
	const [menu, setMenu] = useState(false)
	const [editMe, setEditMe] = useState(false)
	const pages = [
		{ path: "/campaigns", name: "Manage Campaigns" },
		{ path: "/characters", name: "Manage Characters" },
		{ path: "/templatemaker", name: "Create Sheet template" },
		{
			path: "https://greenimp.github.io/rpg-dice-roller/guide/notation/",
			name: "Dice notation help",
			target: "_blank",
		},
	]

	const saveMe = async (entry) => {
		const response = fetches.createOrUpdate(entry, "users/me")
		if (response) setME(entry)
	}

	useEffect(() => {
		const get = async () => {
			if (!me) {
				try {
					const response = await fetches.get("users/me")
					console.log("navbar did mount", response, Location)
					setME(response)
				} catch (error) {}
			}
		}
		get()
	})
	return (
		<div className="mb-2">
			<div
				className={`flex flex-wrap-reverse bg-gray-700 text-yellow-400 pb-1 px-4 gap-2`}
			>
				<div
					onClick={() => {
						setEditMe(!editMe)
					}}
				>
					User: {me && me.name}
				</div>
				{props.children}
				<div className={`flex-grow`}></div>
				<div
					className={`hover:text-white cursor-pointer`}
					onFocus={(e) => {
						console.log("focused menu")
						setMenu(true)
					}}
					onClick={() => setMenu(!menu)}
				>
					Argo://{props.path && props.path}
				</div>
			</div>
			<div
				className={` ${
					!menu && "hidden"
				} flex overflow-y-hidden flex-col absolute right-4 p-2 rounded-b-md z-10 bg-gray-700 text-gray-100`}
			>
				{pages.map((page) => (
					<a
						href={page.path}
						className={` hover:bg-gray-200 hover:text-gray-900 cursor-pointer p-0.5 text-right rounded-sm underline`}
						target={page.target}
					>
						{page.name}
					</a>
				))}
			</div>
			<div
				className={` ${
					!editMe && "hidden"
				} fixed z-10 pl-4 shadow-md transition-shadow`}
			>
				<Element entry={me} edit={true} save={saveMe} />
			</div>
		</div>
	)
}

export default Navbar
