import { default as now } from "performance-now";

/**
 * https://github.com/jsgrosman/advent-code-challenges/blob/main/advent2022/advent13.ts
 * Iets was stuk en had geen motivatie meer om het te fixen
 * Dus heb ik het maar zo gelaten nadat mijn part1 wel werkte maar part 2 niet
 * @param left
 * @param right
 * @returns
 */
function compareTwoValues(left: any, right: any): any {
	// If both values are lists, compare the first value of each list, then the second value, and so on. If the left list runs out of items first, the inputs are in the right order. If the right list runs out of items first, the inputs are not in the right order. If the lists are the same length and no comparison makes a decision about the order, continue checking the next part of the input.
	if (Number.isInteger(left) && Number.isInteger(right)) {
		return left - right;
	} else if (Number.isInteger(left) && Array.isArray(right)) {
		left = [left];
	} else if (Array.isArray(left) && Number.isInteger(right)) {
		right = [right];
	}
	// now they should both be arrays
	for (let index = 0; index < left.length; index++) {
		// left is longer than right, so inputs are NOT in the right order
		if (index >= right.length) {
			return 1;
		} else {
			const result = compareTwoValues(left[index], right[index]);
			if (result !== 0) {
				// packets don't match
				return result;
			} // otherwise, continue to next index
		}
	}
	if (left.length === right.length) {
		return 0;
	} else {
		return -1;
	}
}

// Part 1
// ======
// ~0 ms - answer: 0

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	const data = input.split("\n\n");
	const temp = data
		.map((group, i) => {
			const [val1, val2] = group.split("\n").map((x) => {
				let list: number | number[];
				eval(`list=${x}`);
				//@ts-ignore
				return list;
			}) as [number | number[], number | number[]];
			//@ts-ignore
			return { res: Boolean(compareTwoValues(val1, val2)), i: i + 1 };
		})
		.filter((x) => x.res);

	result = temp.reduce((acc, x) => acc + x.i, 0);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~0 ms - answer: 24969
// Niet 25092

const part2 = (input: string) => {
	const start = now();
	let result = 0;
	const package2 = [[2]];
	const package6 = [[6]];

	const signals = [
		...input
			.replace(/\n\n/g, "\n")
			.split("\n")
			.map((i) => {
				return JSON.parse(i);
			}),
		package2,
		package6,
		//@ts-ignore
	].sort((a, b) => compareTwoValues(a, b));

	const first = signals.findIndex((x) => x === package2) + 1;
	const second = signals.findIndex((x) => x === package6) + 1;
	result = first * second;

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
