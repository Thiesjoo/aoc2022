import { default as now } from "performance-now";

const scores = { X: 1, Y: 2, Z: 3 };
const outcomes = { lost: 0, won: 6, draw: 3 };
const beats = {
	X: "Z",
	Y: "X",
	Z: "Y",
};

const elfToOur = {
	A: "X",
	B: "Y",
	C: "Z",
};

// Part 1
// ======
// ~17 ms - answer: 13221

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	const data = input.split("\n");

	data.forEach((x) => {
		const [tempPlayer1, player2] = x.split(" ") as ["A" | "B" | "C", "X" | "Y" | "Z"];
		const player1 = elfToOur[tempPlayer1];

		if (player1 === player2) {
			result += outcomes.draw + scores[player2];
		} else if (beats[player2] == player1) {
			result += outcomes.won + scores[player2];
		} else {
			result += outcomes.lost + scores[player2];
		}
	});

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~15 ms - answer: 13131

const part2 = (input: string) => {
	const start = now();
	let result = 0;

	const data = input.split("\n");

	data.forEach((x) => {
		const [tempPlayer1, strategy] = x.split(" ") as ["A" | "B" | "C", "X" | "Y" | "Z"];
		const player1 = elfToOur[tempPlayer1] as "X" | "Y" | "Z";

		if (strategy === "X") {
			// Should lose
			const chosen = beats[player1] as "X" | "Y" | "Z";

			result += outcomes.lost + scores[chosen];
		} else if (strategy === "Y") {
			// Should draw
			result += outcomes.draw + scores[player1];
		} else if (strategy === "Z") {
			// Should win
			const chosen = Object.entries(beats).find((x) => x[1] === player1)?.[0] as "X" | "Y" | "Z";

			result += outcomes.won + scores[chosen];
		}
	});

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
