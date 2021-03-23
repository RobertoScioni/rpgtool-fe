import { useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import createDataUri from "create-data-uri"
import ab2str from "arraybuffer-to-string"

const character = (props) => {
	const [edit, setEdit] = useState()

	return (
		<>
			{edit ? (
				<form
					className=" w-max flex flex-row p-2 border-solid border-2 rounded-md border-black h-36"
					onSubmit={(e) => {
						e.preventDefault()
						setSave(!save)
					}}
				>
					<span
						{...getRootProps({ className: "dropzone" })}
						className="mr-2 h-full w-1/4"
					>
						<img
							src={acceptedFiles.length ? file.preview : "character.png"}
							className="object-scale-down h-32 "
						></img>
						<input {...getInputProps()} />
					</span>
					<span className="flex flex-col">
						<aside className="flex flex-row p-1 pt-0">
							<ul className="flex-grow">{/*files*/}</ul>
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
							value={name}
							onChange={(e) => {
								setName(e.target.value)
							}}
						></input>
					</span>
				</form>
			) : (
				<div
					className=" w-max flex flex-row p-2 border-solid border-2 rounded-md border-black h-36"
					onSubmit={(e) => {
						e.preventDefault()
						setSave(!save)
					}}
				>
					<span
						{...getRootProps({ className: "dropzone" })}
						className="mr-2 h-full w-1/4"
					>
						<img
							src={acceptedFiles.length ? file.preview : "character.png"}
							className="object-scale-down h-32 "
						></img>
						<input {...getInputProps()} />
					</span>
					<span className="flex flex-col">
						<aside className="flex flex-row p-1 pt-0">
							<ul className="flex-grow">{/*files*/}</ul>
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
							value={name}
							onChange={(e) => {
								setName(e.target.value)
							}}
						></input>
					</span>
				</div>
			)}
		</>
	)
}
