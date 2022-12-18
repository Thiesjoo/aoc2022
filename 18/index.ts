import { default as now } from "performance-now";

const DIRS = [
	[1, 0, 0],
	[-1, 0, 0],
	[0, 1, 0],
	[0, -1, 0],
	[0, 0, 1],
	[0, 0, -1],
];

// Part 1
// ======
// ~0 ms - answer: 0

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	const map = new Set<string>();
	input.split("\n").forEach((x) => {
		map.add(x);
	});

	[...map].forEach((val) => {
		const [x, y, z] = val.split(",").map(Number);
		const neighbors = DIRS.map(([dx, dy, dz]) => `${x + dx},${y + dy},${z + dz}`);
		const activeNeighbors = neighbors.filter((x) => map.has(x));
		result += neighbors.length - activeNeighbors.length;
	});

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~0 ms - answer: 0

const part2 = (input: string) => {
	const start = now();
	let result = 0;
	const map = new Map<string, number>();
	const init = [] as string[];
	input.split("\n").forEach((x) => {
		map.set(x, 1);
		init.push(x);
	});

	let TOSET = 2;

	const lowerBound = -1;
	const upperBound = 25;
	const forLoopLower = -1;
	const forLoopUpper = 25;

	const dfs = (loc: string) => {
		let stack = [] as string[];
		stack.push(loc);
		while (stack.length > 0) {
			let current = stack.pop()!;
			let [x, y, z] = current.split(",").map(Number);

			if (x < lowerBound || x > upperBound) continue;
			if (y < lowerBound || y > upperBound) continue;
			if (z < lowerBound || z > upperBound) continue;
			if (map.has(current)) continue;
			map.set(current, TOSET);

			for (let i = 0; i < 6; i++) {
				let [dx, dy, dz] = DIRS[i];
				stack.push(`${x + dx},${y + dy},${z + dz}`);
			}
		}
	};

	for (let i = forLoopLower; i < forLoopUpper; i++) {
		for (let j = forLoopLower; j < forLoopUpper; j++) {
			for (let k = forLoopLower; k < forLoopUpper; k++) {
				dfs(`${i},${j},${k}`);
				if (map.get(`${i},${j},${k}`) == TOSET) {
					TOSET++;
				}
			}
		}
	}

	init.forEach((loc) => {
		const [x, y, z] = loc.split(",").map(Number);
		const neighbors = DIRS.map(([dx, dy, dz]) => `${x + dx},${y + dy},${z + dz}`);
		const activeNeighbors = neighbors.filter((x) => map.has(x) && map.get(x) == 2);
		result += activeNeighbors.length;
	});

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
