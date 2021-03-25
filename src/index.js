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
import NavBar from "./Components/Navbar"

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
				<NavBar />
				<Chat />
			</Route>
			<Route exact path="/chat">
				<NavBar />
				<Chat />
			</Route>
			<Route exact path="/scenes">
				<NavBar />
				<Scenes />
			</Route>
			<Route path="/scene/:id">
				<NavBar />
				<Scene />
			</Route>
			<Route exact path="/characters">
				<NavBar />
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
