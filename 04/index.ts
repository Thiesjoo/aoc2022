import { default as now } from "performance-now";

// Part 1
// ======
// ~2.8 ms - answer: 580

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	const sections = input.split("\n").map((x) => {
		const [one, two] = x.split(",").map((y) => y.split("-").map((z) => +z));
		return [one, two];
	});

	sections.forEach(([[a, b], [c, d]]) => {
		// Is the start earlier than prev start, but the end greater
		// OR all symbols flipped
		if ((a <= c && b >= d) || (c <= a && d >= b)) {
			result++;
		}
	});

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~2.8 ms - answer: 895

const part2 = (input: string) => {
	const start = now();
	let result = 0;

	const sections = input.split("\n").map((x) => {
		const [one, two] = x.split(",").map((y) => y.split("-").map((z) => +z));
		return [one, two];
	});

	sections.forEach(([[a, b], [c, d]]) => {
		// Is the entire section after the other section
		if ((a >= d && c >= b) || (b >= c && d >= a)) {
			result++;
		}
	});
	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
