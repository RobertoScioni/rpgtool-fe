import { useState } from "react"
const DiceRoller = (props) => {
	const [expression, setExpression] = useState("[]")

	const handleKeyboard = (key) => {
		if (key === "AC") {
			setExpression("[]")
			return
		}
		if (key === "←") {
			setExpression(
				"[" + expression.substring(1, expression.length - 2).concat("]")
			)
			return
		}
		let input =
			"[" + expression.substring(1, expression.length - 1).concat(key, "]")

		//input = String("[" + input + "]")
		setExpression(input)
	}

	return (
		<div className={`mx-auto flex flex-col w-max`}>
			<div className="m-4 flex ring-2 ring-offset-8 ring-offset-gray-900 ring-gray-400">
				<input
					type="text"
					title="die notation"
					placeholder="00"
					className="w-full p-1 text-gray-900"
					value={expression}
					onChange={(e) => {
						setExpression(e.target.value)
					}}
				></input>
				<button onClick={() => props.appendInput(expression)}>send</button>
			</div>
			<div className="w-full grid grid-cols-7 gap-2">
				{[4, 6, 8, 10, 12, 20, 100, "F", 2].map((dice, index) => (
					<button
						className="rounded-full bg-gray-500 "
						value={"d" + dice}
						onClick={() => handleKeyboard("d" + dice)}
						key={"d" + index}
					>
						{dice !== 2 ? "d" + dice : "coin"}
					</button>
				))}
				<div></div>
			</div>
			<div className="w-full grid grid-cols-6 gap-2 mt-2">
				{[
					7,
					8,
					9,
					"←",
					"d",
					"+",
					4,
					5,
					6,
					"",
					"*",
					"/",
					1,
					2,
					3,
					"",
					"d",
					"AC",
					"",
					0,
				].map((value, index) => {
					if (value === "") {
						return <div></div>
					} else {
						return (
							<button
								className="rounded-full bg-gray-500 "
								value={value}
								onClick={() => handleKeyboard(value)}
								key={index}
							>
								{value}
							</button>
						)
					}
				})}
			</div>
		</div>
	)
}
export default DiceRoller
