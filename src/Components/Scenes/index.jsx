/**
 * feture list:
 * list scenes
 * create a scene
 * edit a scene
 * add players to a scene
 * add characters to the scene may need a player character list component
 */

const Scenes = () => {
	return (
		<div className="h-screen flex flex-col">
			<div className="bg-red-800 p-1 m-2 mb-0">menu area</div>
			<div className="flex-grow bg-blue-500 border-solid border-4 border-light-blue-500 mx-2 overflow-y-hidden">
				<form>
					<input placeholder=" scene-name"></input>
				</form>
			</div>
		</div>
	)
}

export default Scenes
