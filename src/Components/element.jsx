import { useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"

const Element = (props) => {
	//console.log("print the element", props.entry)
	const [edit, setEdit] = useState(true)
	const [file, setFile] = useState([])
	const [name, setName] = useState("")
	const [dsc, setDsc] = useState("")
	const [imgURL, setURL] = useState("character.png")
	const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
		accept: "image/*",
		onDrop: (acceptedFiles) => {
			setFile(
				Object.assign(acceptedFiles[0], {
					preview: URL.createObjectURL(acceptedFiles[0]),
				})
			)
		},
	})
	useEffect(
		() => () => {
			// Make sure to revoke the data uris to avoid memory leaks
			URL.revokeObjectURL(file.preview)
		},
		[file]
	)

	useEffect(() => {
		console.log("component did mount")
		if (props.entry) {
			setEdit(false)
			setName(props.entry.name)
			setDsc(props.entry.dsc)
			setURL(props.entry.imageUrl)
		}
		if (props.edit) setEdit(true)
	}, [props])

	return (
		<div
			className="flex flex-row h-28 w-72"
			onKeyDown={(e) => {
				if (e.key === "Escape") {
					setEdit(false)
				}
			}}
		>
			<span
				{...getRootProps({
					className:
						"dropzone mr-2 h-full w-1/2 overflow-y-hidden flex justify-center align-center bg-gray-500 rounded-md ring-1 ring-gray-50",
				})}
			>
				<img
					src={acceptedFiles.length ? file.preview : imgURL}
					alt="element"
					className="object-scale-down "
				></img>
				<input {...getInputProps()} disabled={!edit} />
			</span>
			<span className="flex flex-col">
				<div className="flex">
					<input
						placeholder={props.placeholder ? props.placeholder : "name"}
						className="mb-2 w-full rounded-sm p-0.5 ring-1 ring-gray-50"
						value={name}
						onChange={(e) => {
							setName(e.target.value)
						}}
						disabled={!edit}
					></input>

					<button
						className="h-8 w-8 m2 align-top "
						onClick={(e) => {
							if (edit) {
								props.save({
									name,
									dsc,
									file,
									_id: props.entry ? props.entry._id : undefined,
								})
								if (!props.entry) setFile([])
								if (props.placeholder) {
									setName("")
									setDsc("")
								}
								setEdit(props.entry ? false : true)
							} else {
								setEdit(true)
							}
						}}
					>
						{edit ? (
							<svg
								className="h-8 w-8 text-yellow-800"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								{" "}
								<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />{" "}
								<polyline points="17 21 17 13 7 13 7 21" />{" "}
								<polyline points="7 3 7 8 15 8" />
							</svg>
						) : (
							<svg
								className="h-8 w-8 text-yellow-800"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
								/>
							</svg>
						)}
					</button>
				</div>

				<textarea
					placeholder="Description"
					className="resize-none flex-grow w-full self-end rounded-sm p-0.5 ring-1 ring-gray-50"
					value={dsc}
					onChange={(e) => {
						setDsc(e.target.value)
					}}
					disabled={!edit}
				></textarea>
			</span>
		</div>
	)
}

export default Element
