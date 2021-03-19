/**
 * feture list:
 * list characters
 * create a character
 * edit a character
 */
import { useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import createDataUri from "create-data-uri"
import ab2str from "arraybuffer-to-string"
const Characters = () => {
	const { acceptedFiles, getRootProps, getInputProps } = useDropzone()
	const files = acceptedFiles.map((file) => (
		<li key={file.path}>{file.path}</li>
	))
	const [save, setSave] = useState(false)
	const [name, setName] = useState("")
	const [bio, setBio] = useState("")

	useEffect(() => {
		if (save) {
			console.log("i'm gonna save this character")
		}
	}, [save])
	return (
		<div className="h-screen flex flex-col">
			<div className="bg-red-800 p-1 m-2 mb-0">menu area</div>
			<div className="flex-grow bg-blue-500 border-solid border-4 border-light-blue-500 mx-2 overflow-y-hidden">
				<form
					className=" w-max flex flex-row p-2 border-solid border-2 rounded-md border-black"
					onSubmit={(e) => {
						e.preventDefault()
						setSave(!save)
					}}
				>
					<span {...getRootProps({ className: "dropzone" })} className="mr-2">
						<img src="character.png" className=""></img>
						<input {...getInputProps()} />
					</span>
					<span className="flex flex-col">
						<aside className="flex flex-row p-1 pt-0">
							<ul className="flex-grow">{files}</ul>
							<button name="Save" type="submit" className="ml-2">
								SAVE
							</button>
						</aside>
						<div className="flex-grow pb-1">
							<textarea
								rows="2"
								placeholder="Description"
								className="resize-none w-full"
							></textarea>
						</div>

						<input placeholder=" character name" className="pt-1"></input>
					</span>
				</form>
			</div>
		</div>
	)
}

export default Characters
