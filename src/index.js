import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Route } from "react-router-dom"
import "./index.css"
import reportWebVitals from "./reportWebVitals"
import Login from "./Components/Login"
import Register from "./Components/register"
import Chat from "./Components/Chat"
import Scenes from "./Components/Scenes"
import Scene from "./Components/Scenes/scene"
import Campaigns from "./Components/Campaigns"
import Campaign from "./Components/Campaigns/Campaign"
import Characters from "./Components/Characters"
import NavBar from "./Components/Navbar"
import Dashboard from "./Components/Dashboard"

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
			<Route exact path="/register">
				<Register />
			</Route>
			<Route exact path="/dashboard">
				<Dashboard />
			</Route>
			<Route path="/chat/:id">
				<NavBar />
				<Chat />
			</Route>
			<Route exact path="/chat">
				<NavBar />
				<Chat />
			</Route>
			<Route exact path="/campaigns">
				<NavBar />
				<Campaigns />
			</Route>
			<Route exact path="/campaign/:id">
				<NavBar />
				<Campaign />
			</Route>
			<Route exact path="/scenes">
				<NavBar />
				<Scenes />
			</Route>
			<Route exact path="/scenes/:id">
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
