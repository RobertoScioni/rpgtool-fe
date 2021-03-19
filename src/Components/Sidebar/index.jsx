/**
 * feture list:
 * main component of the mvp, will be only a sidebar in the complete product
 *
 * it does the composition and navigation
 *
 *
 */
import Navbar from "../Components/navbar"
const Scenes = () => {
	const [page, setPage] = useState("chat")
	const pages = ["chat", "scenes", "macropad"]

	return (
		<div className="h-screen flex flex-col">
			<Navbar />
			{page}
			<div className="flex-grow bg-blue-500 border-solid border-4 border-light-blue-500 mx-2 overflow-y-hidden"></div>
		</div>
	)
}

export default Scenes
