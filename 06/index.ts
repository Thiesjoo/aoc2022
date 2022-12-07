import { default as now } from "performance-now";

function getStartOfMsg(input: string, distinct: number) {
	let current = [...input.slice(0, distinct)];
	if (new Set(current).size === distinct) {
		return 0;
	}

	for (let i = distinct; i < input.length; i++) {
		current.shift();
		current.push(input[i]);
		if (new Set(current).size === distinct) {
			return i + 1;
		}
	}
}

// Part 1
// ======
// ~1 ms - answer: 1544

const part1 = (input: string) => {
	const start = now();
	let result = getStartOfMsg(input, 4);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~4 ms - answer: 2145

const part2 = (input: string) => {
	const start = now();
	let result = getStartOfMsg(input, 14);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
