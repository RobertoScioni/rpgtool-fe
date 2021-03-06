import React, { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
/* Stuff to do, theming and validation for the mail*/

const Login = () => {
	const [email, setMail] = useState("")
	/*i would really prefer a way to store the password less vulnerable to cross scripting, 
        if react dev tool can read the state so could a lot of other extensions*/
	const [password, setPassword] = useState("")
	const [send, setSend] = useState(true)
	let history = useHistory()

	useEffect(() => {
		const checklogin = async () => {
			console.log("before the fech")
			try {
				let response = await fetch(`${process.env.REACT_APP_BACKEND}/users/`, {
					method: "GET",
					credentials: "include",
					headers: new Headers({
						"Content-Type": "application/json",
					}),
				})

				if (response.status === 200) {
					history.push("/campaigns")
				} else console.log("not logged in")
			} catch (error) {
				console.log("not logged in", error)
			}
		}
		console.log("component did mount")
		checklogin()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(
		() => async () => {
			console.log("here goeas the fetch, in theory at least")
			//const body = { email, password }
			try {
				let me = await fetch(`${process.env.REACT_APP_BACKEND}/users/login`, {
					method: "POST",
					credentials: "include",
					body: JSON.stringify({ email, password }),
					headers: new Headers({
						"Content-Type": "application/json",
					}),
				})
				if (me.status === 200) {
					me = await me.json()
					console.log(me)
					localStorage.setItem("id", me.id)
					history.push("/campaigns")
				}
			} catch (error) {
				console.log(error)
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[send]
	)

	const submit = (e) => {
		e.preventDefault()
		console.log("your friendly submit function")
		setSend(!send)
	}
	return (
		<div className="h-screen flex items-center bg-dark-gray">
			<form
				action="submit"
				onSubmit={(e) => submit(e)}
				className="mx-auto align-middle flex flex-col m-2 p-2 w-1/2 border-solid border-4 border-aqua-600 rounded-tl-2xl rounded-br-2xl"
			>
				<input
					type="text"
					placeholder="Email"
					value={email}
					onChange={(e) => setMail(e.target.value)}
					className="m-1 p-2"
				/>
				<input
					type="password"
					placeholder="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") submit(e)
					}}
					className="m-1 p-2"
				/>
				<div className="flex items-center">
					<button
						type="submit"
						className="m-1 mx-auto p-2 w-min text-green-500 hover:text-white"
					>
						Login
					</button>
					<p className="font-bold text-green-500">or</p>
					<a
						href="register"
						className="m-1 mx-auto p-2 w-min text-green-500 hover:text-white"
					>
						Register
					</a>
				</div>
			</form>
		</div>
	)
}

export default Login
