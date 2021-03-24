import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Route } from "react-router-dom"
import "./index.css"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import Login from "./Components/Login"
import Chat from "./Components/Chat"
import Scenes from "./Components/Scenes"
import Scene from "./Components/Scenes/scene"
import Characters from "./Components/Characters"

console.log("backend at", process.env.REACT_APP_BACKEND)

ReactDOM.render(
	<BrowserRouter>
		<React.StrictMode>
			<Route exact path="/">
				<Login />
			</Route>
			<Route exact path="/login">
				<Login />
			</Route>
			<Route path="/chat/:id">
				<Chat />
			</Route>
			<Route exact path="/chat">
				<Chat />
			</Route>
			<Route exact path="/scenes">
				<Scenes />
			</Route>
			<Route path="/scene/:id">
				<Scene />
			</Route>
			<Route exact path="/characters">
				<Characters />
			</Route>
		</React.StrictMode>
	</BrowserRouter>,
	document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
