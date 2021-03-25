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
	const [save, setSave] = useState(false)
	const [userName, setName] = useState("")
	const [bio, setBio] = useState("")
	const [file, setFile] = useState([])
	const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
		accept: "image/*",
		onDrop: (acceptedFiles) => {
			setFile(
				Object.assign(acceptedFiles[0], {
					preview: URL.createObjectURL(acceptedFiles[0]),
				})
				/*acceptedFiles.map((file) =>
					Object.assign(file, {
						preview: URL.createObjectURL(file),
					})
				)*/
			)
		},
	})
	const files = acceptedFiles.map((file) => (
		<li key={file.path}>{file.path}</li>
	))
	useEffect(
		() => () => {
			// Make sure to revoke the data uris to avoid memory leaks
			URL.revokeObjectURL(file.preview)
		},
		[file]
	)

	useEffect(async () => {
		if (save) {
			if (acceptedFiles.length === 0) {
				console.log("character picture is mandatory")
				return
			}
			let id = await fetch(`${process.env.REACT_APP_BACKEND}/characters/`, {
				method: "PUT",
				credentials: "include",
				body: JSON.stringify({ userName }),
				headers: new Headers({
					"Content-Type": "application/json",
				}),
			})
			id = await id.json()
			console.log(id)
			const formData = new FormData()
			formData.append("image", file, file.name)
			fetch(`${process.env.REACT_APP_BACKEND}/users/imageUpload/${id}`, {
				method: "POST",
				credentials: "include",
				body: formData,
				headers: new Headers({}),
			})
		}
	}, [save])
	return (
		<div className="h-screen flex flex-col">
			<div className="flex-grow bg-blue-500 border-solid border-4 border-light-blue-500 mx-2 overflow-y-hidden">
				<form
					className=" w-max flex flex-row p-2 border-solid border-2 rounded-md border-black"
					onSubmit={(e) => {
						e.preventDefault()
						setSave(!save)
					}}
				>
					<span {...getRootProps({ className: "dropzone" })} className="mr-2">
						<img
							src={acceptedFiles.length ? file.preview : "character.png"}
							className=""
						></img>
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
								value={bio}
								onChange={(e) => {
									setBio(e.target.value)
								}}
							></textarea>
						</div>

						<input
							placeholder=" character name"
							className="pt-1"
							value={userName}
							onChange={(e) => {
								setName(e.target.value)
							}}
						></input>
					</span>
				</form>
			</div>
		</div>
	)
}

export default Characters
