import Element from "../element"
const Dashboard = () => {
	const index = 1
	return (
		<div className="flex">
			<div>
				<Element />
			</div>
			<div>
				<h4>create a character</h4>
				<Element />
			</div>
			<div>
				<h4>create a campaign</h4>
				<Element />
			</div>
		</div>
	)
}

export default Dashboard
