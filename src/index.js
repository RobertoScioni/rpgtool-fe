import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Route } from "react-router-dom"
import "./index.css"
import reportWebVitals from "./reportWebVitals"
import Login from "./Components/Login"
import Register from "./Components/register"
import Chat from "./Components/Chat"
import Scene from "./Components/Scenes/scene"
import Campaign from "./Components/Campaigns/Campaign"
import Character from "./Components/Characters/editSheet"
import TemplateMaker from "./Components/TemplateMaker"
import Manager from "./Components/Element manager"

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
			<Route path="/chat/:id/:scene">
				<Chat />
			</Route>
			<Route path="/chat/:id/">
				<Chat />
			</Route>
			<Route exact path="/campaigns">
				<Manager mode="campaigns" />
			</Route>
			<Route exact path="/campaign/:id">
				<Campaign />
			</Route>
			<Route exact path="/scenes/:campaignId">
				<Manager mode="campaigns" />
			</Route>
			<Route path="/scene/:campaignId/:id">
				<Scene />
			</Route>
			<Route exact path="/characters">
				<Manager mode="characters" />
			</Route>
			<Route exact path="/character/:characterId">
				<Character />
			</Route>
			<Route exact path="/templatemaker">
				<TemplateMaker />
			</Route>
		</React.StrictMode>
	</BrowserRouter>,
	document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
