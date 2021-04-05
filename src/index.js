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
				<Campaigns />
			</Route>
			<Route exact path="/campaign/:id">
				<Campaign />
			</Route>
			<Route exact path="/scenes">
				<Scenes />
			</Route>
			<Route exact path="/scenes/:id">
				<Scenes />
			</Route>
			<Route path="/scene/:campaignId/:id">
				<Scene />
			</Route>
			<Route exact path="/characters">
				<Characters />
			</Route>
			<Route exact path="/character/:characterId">
				<Character />
			</Route>
			<Route exact path="/templatemaker">
				<TemplateMaker />
			</Route>
			<Route path="/debug/:mode/">
				<Manager />
			</Route>
			<Route path="/debug/:mode/:campaignId/">
				<Manager />
			</Route>
		</React.StrictMode>
	</BrowserRouter>,
	document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
