const createOrUpdate = async (entry, mode) => {
	//this function should detect if we are creating a character campaign of scene and fetch accordingly
	console.log(
		"welcome into the create element function - the mode is:",
		mode,
		"the entry is",
		entry
	)
	try {
		//each entity has at least these fields
		let address = mode
		let body = {
			name: entry.name,
			dsc: entry.dsc,
		}
		console.log("body", body, "address", address)
		//scenes will also have a campaign field
		if (entry.hasOwnProperty("campaign") && !entry.id) {
			body = {
				...body,
				campaign: entry.campaign._id,
				members: [...entry.campaign.members],
			}
			address = "scenes"
			console.log(
				"semmes like we have a scene---body",
				body,
				"address",
				address
			)
		}
		let _id = await fetch(
			`${process.env.REACT_APP_BACKEND}/${address}/${
				entry._id ? entry._id : ""
			}`,
			{
				method: `${entry._id ? "PUT" : "POST"}`,
				credentials: "include",
				body: JSON.stringify(body),
				headers: new Headers({
					"Content-Type": "application/json",
				}),
			}
		)
		_id = entry._id ? entry._id : await _id.json()
		//not everything should need an image
		if (entry.file.length !== 0) {
			const formData = new FormData()
			formData.append("image", entry.file, entry.file.name)
			let response = await fetch(
				`${process.env.REACT_APP_BACKEND}/${address}/imageUpload/${_id}`,
				{
					method: "POST",
					credentials: "include",
					body: formData,
					headers: new Headers({}),
				}
			)
			console.log(response)
		}
		//scene only code
		if (entry.hasOwnProperty("campaign")) {
			let response = await fetch(
				`${process.env.REACT_APP_BACKEND}/campaigns/${entry.campaign._id}/addScene/${_id}`,
				{
					method: "POST",
					credentials: "include",
					//body: JSON.stringify({ scene: _id }),
					headers: new Headers({}),
				}
			)
			console.log(response)
		}
	} catch (error) {
		console.log(error)
	}
}

const remove = async (entry, mode) => {
	let response = await fetch(
		`${process.env.REACT_APP_BACKEND}/${mode}/${entry._id}`,
		{
			method: "DELETE",
			credentials: "include",
			headers: new Headers({
				"Content-Type": "application/json",
			}),
		}
	)
	response = await response.body
	//scenes should also be removed from their campaigns List
	if (mode === "scenes") {
		response = await fetch(
			`${process.env.REACT_APP_BACKEND}/campaigns/${entry.campaign}/removeScene/${entry._id}`,
			{
				method: "POST",
				credentials: "include",
				headers: new Headers({
					"Content-Type": "application/json",
				}),
			}
		)
		response = await response.json()
	}
	console.log("###DELETE###")
	console.log(response)
	return response
}

const get = async (mode) => {
	try {
		let response = await fetch(`${process.env.REACT_APP_BACKEND}/${mode}`, {
			method: "GET",
			credentials: "include",
			headers: new Headers({
				"Content-Type": "application/json",
			}),
		})
		response = await response.json()
		return response
	} catch (error) {
		console.log("get error", error)
		return error
	}
}

export { createOrUpdate, remove, get }
