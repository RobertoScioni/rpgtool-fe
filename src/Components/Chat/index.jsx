import React, { useState, useEffect } from "react"
import io from "socket.io-client"

const connOptions = {
	transports: ["websocket", "polling"],
	auth: {
		token: "abc",
	}, // socket connectin options
}

let socket = io("127.0.0.1:9999", connOptions) //socket instance
const Chat = () => {
	const [messages, setMessages] = useState([])
	useEffect(() => {
		socket.on("bmsg", (msg) => setMessages((messages) => messages.concat(msg)))
		//listening to any event of type "bmsg" and reacting by calling the function
		//that will append a new message to the "messages" array

		socket.on("connect", () => console.log("connected to socket")) //check if socket is connected
		return () => socket.removeAllListeners() //componentWillUnmount
	}, [])
	return (
		<div className="h-screen flex flex-col">
			<div className="flex-grow border-solid border-4 border-light-blue-500 m-2"></div>
			<form className="flex">
				<input
					type="text"
					placeholder="send message"
					className="flex-grow m-2 p-2"
				></input>
				<input type="submit" className="m-2 p-2" />
			</form>
		</div>
	)
}
export default Chat
