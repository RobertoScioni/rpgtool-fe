import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Route } from "react-router-dom"
import "./index.css"
import reportWebVitals from "./reportWebVitals"
import Login from "./Components/Login"
import Register from "./Components/register"
import Chat from "./Components/Chat"
import Character from "./Components/Characters/editSheet"
import TemplateMaker from "./Components/TemplateMaker"
import Manager from "./Components/Element manager"
import Invites from "./Components/Element manager/Invites"

console.log("backend at", process.env.REACT_APP_BACKEND)

ReactDOM.render(
	<BrowserRouter>
		<React.StrictMode>
			{/* auth routes */}
			<Route exact path="/">
				<Login />
			</Route>
			<Route exact path="/login">
				<Login />
			</Route>
			<Route exact path="/register">
				<Register />
			</Route>
			{/* chat routes */}
			<Route exact path="/chat/:campaignName/:sceneId">
				<Chat />
			</Route>
			<Route exact path="/chat/:id">
				<Chat />
			</Route>
			{/* campaign routes */}
			<Route exact path="/campaigns">
				<Manager mode="campaigns" />
			</Route>
			<Route exact path="/campaign/:id">
				<Invites />
			</Route>
			{/* scene routes */}
			<Route exact path="/scenes/:campaignId">
				<Manager mode="scenes" />
			</Route>
			<Route path="/scene/:campaignId/:id">
				<p>invite manager should render here</p>
				<Invites />
			</Route>
			{/* character Routes */}
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
