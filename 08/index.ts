import { default as now } from "performance-now";

// Part 1
// ======
// ~0 ms - answer: 0

const part1 = (input: string) => {
	const start = now();
	const data = input.split("\n").map((x) => x.split("").map((y) => +y));

	const isEdge = (i: number, j: number) => i === 0 || i === data.length - 1 || j === 0 || j === data[0].length - 1;
	const visible = new Set<string>();

	for (let i = 0; i < data.length; i++) {
		for (let j = 0; j < data[i].length; j++) {
			if (isEdge(i, j)) {
				visible.add(`${i},${j}`);
				continue;
			}
			// Check if tree is visible from ANY direction
			let upOk = 1;
			let downOk = 1;
			let leftOk = 1;
			let rightOk = 1;
			for (let k = i - 1; k >= 0; k--) {
				if (data[k][j] >= data[i][j]) {
					upOk--;
					break;
				}
			}

			for (let k = i + 1; k < data.length; k++) {
				if (data[k][j] >= data[i][j]) {
					downOk--;
					break;
				}
			}

			for (let k = j - 1; k >= 0; k--) {
				if (data[i][k] >= data[i][j]) {
					leftOk--;
					break;
				}
			}

			for (let k = j + 1; k < data[i].length; k++) {
				if (data[i][k] >= data[i][j]) {
					rightOk--;
					break;
				}
			}

			if (upOk > 0 || downOk > 0 || leftOk > 0 || rightOk > 0) {
				visible.add(`${i},${j}`);
			}
		}
	}

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return visible.size;
};

// Part 2
// ======
// ~5.6 ms - answer: 537600

const part2 = (input: string) => {
	const start = now();
	let result = 0;

	const data = input.split("\n").map((x) => x.split("").map((y) => +y));

	const isEdge = (i: number, j: number) => i === 0 || i === data.length - 1 || j === 0 || j === data[0].length - 1;
	// Columns checking
	for (let i = 0; i < data.length; i++) {
		for (let j = 0; j < data[i].length; j++) {
			if (isEdge(i, j)) {
				continue;
			}

			let upOk = 0;
			let downOk = 0;
			let leftOk = 0;
			let rightOk = 0;
			for (let k = i - 1; k >= 0; k--) {
				upOk++;
				if (data[k][j] >= data[i][j]) {
					break;
				}
			}

			for (let k = i + 1; k < data.length; k++) {
				downOk++;
				if (data[k][j] >= data[i][j]) {
					break;
				}
			}

			for (let k = j - 1; k >= 0; k--) {
				leftOk++;
				if (data[i][k] >= data[i][j]) {
					break;
				}
			}

			for (let k = j + 1; k < data[i].length; k++) {
				rightOk++;
				if (data[i][k] >= data[i][j]) {
					break;
				}
			}

			result = Math.max(result, upOk * downOk * leftOk * rightOk);
		}
	}

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
