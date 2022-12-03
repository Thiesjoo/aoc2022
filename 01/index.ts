import { default as now } from "performance-now";

// Part 1
// ======
// ~0.5 ms - answer: 70764

const part1 = (input: string) => {
	const start = now();
	let result;

	const data = input.split("\n\n").map((x) => x.split("\n"));
	const summed = data.map((x) => {
		return x.reduce((a, b) => {
			return a + parseInt(b);
		}, 0);
	});

	result = Math.max(...summed);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~0.8 ms - answer: 203905

const part2 = (input: string) => {
	const start = now();
	let result = 0;

	const data = input.split("\n\n").map((x) => x.split("\n"));
	const summed = data.map((x) => {
		return x.reduce((a, b) => {
			return a + parseInt(b);
		}, 0);
	});

	summed.sort((a, b) => b - a);
	const firstThree = summed.slice(0, 3);
	result = firstThree.reduce((a, b) => a + b, 0);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
