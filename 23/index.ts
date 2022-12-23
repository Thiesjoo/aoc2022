import { default as now } from "performance-now";

const DIRECTIONS = {
	N: { x: 0, y: -1 },
	E: { x: 1, y: 0 },
	S: { x: 0, y: 1 },
	W: { x: -1, y: 0 },
	NE: { x: 1, y: -1 },
	NW: { x: -1, y: -1 },
	SE: { x: 1, y: 1 },
	SW: { x: -1, y: 1 },
};

const DIRECTIONS_ARRAY = [
	["N", "NE", "NW"],
	["S", "SE", "SW"],
	["W", "NW", "SW"],
	["E", "NE", "SE"],
] as (keyof typeof DIRECTIONS)[][];

const calculateDir = (a: { x: number; y: number }, dir: keyof typeof DIRECTIONS) => {
	return {
		x: a.x + DIRECTIONS[dir].x,
		y: a.y + DIRECTIONS[dir].y,
	};
};

const addLoc = (a: { x: number; y: number }, b: { x: number; y: number }) => {
	return {
		x: a.x + b.x,
		y: a.y + b.y,
	};
};

const getLoc = (curren: { x: number; y: number }, map: any) => {
	return map.has(`${curren.x},${curren.y}`);
};

const strToCoord = (str: string) => {
	const [x, y] = str.split(",").map((x) => parseInt(x));
	return { x, y };
};

const getAllNeighbours = (current: { x: number; y: number }, map: any) => {
	return Object.values(DIRECTIONS)
		.map((dir) => getLoc(addLoc(current, dir), map))
		.filter((x) => x);
};

const getNewDirections = (current: { x: number; y: number }, map: any, round: number) => {
	for (let i = round; i < round + 4; i++) {
		const [a, b, c] = DIRECTIONS_ARRAY[i % 4];
		if (
			!getLoc(calculateDir(current, a), map) &&
			!getLoc(calculateDir(current, b), map) &&
			!getLoc(calculateDir(current, c), map)
		) {
			// console.log(
			// 	"Considered:",
			// 	a,
			// 	"for current",
			// 	current,
			// 	"and round",
			// 	round,
			// 	a,
			// 	calculateDir(current, a),
			// 	b,
			// 	calculateDir(current, b),
			// 	c,
			// 	calculateDir(current, c),
			// 	getLoc(calculateDir(current, a), map),
			// 	getLoc(calculateDir(current, b), map),
			// 	getLoc(calculateDir(current, c), map)
			// );
			return a;
		}
	}
	return null;
};

// Part 1
// ======
// ~100 ms - answer: 4005

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	const data = input.split("\n").map((x) => x.split(""));

	const map = new Set<string>();

	data.forEach((x, i) => {
		x.forEach((y, j) => {
			if (y === "#") {
				map.add(`${j},${i}`);
			}
		});
	});

	for (let i = 0; i < 10; i++) {
		const elvesToProcess = [...map].filter((x) => getAllNeighbours(strToCoord(x), map).length !== 0);
		const moves = [] as { from: string; to: string }[];
		const moveDupes = new Map<string, number>();
		elvesToProcess.forEach((x) => {
			const newDir = getNewDirections(strToCoord(x), map, i);
			if (newDir === null) return;
			const proposed = calculateDir(strToCoord(x), newDir);
			const proposedStr = `${proposed.x},${proposed.y}`;
			moveDupes.set(proposedStr, (moveDupes.get(proposedStr) ?? 0) + 1);
			moves.push({ from: x, to: proposedStr });
		});

		let processed = false;
		moves.forEach((move) => {
			if (moveDupes.get(move.to) === 1) {
				map.delete(move.from);
				map.add(move.to);
				processed = true;
			}
		});
	}

	const maxRow = Math.max(...[...map].map((x) => strToCoord(x).y));
	const maxCol = Math.max(...[...map].map((x) => strToCoord(x).x));

	const minRow = Math.min(...[...map].map((x) => strToCoord(x).y));
	const minCol = Math.min(...[...map].map((x) => strToCoord(x).x));

	// Count empty spaces
	for (let i = minRow; i <= maxRow; i++) {
		for (let j = minCol; j <= maxCol; j++) {
			if (!map.has(`${j},${i}`)) {
				result++;
			}
		}
	}

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~5566 ms - answer: 1008

const part2 = (input: string) => {
	const start = now();
	let result = 0;

	const data = input.split("\n").map((x) => x.split(""));

	const map = new Set<string>();

	data.forEach((x, i) => {
		x.forEach((y, j) => {
			if (y === "#") {
				map.add(`${j},${i}`);
			}
		});
	});

	for (let i = 0; i < 10000000; i++) {
		const elvesToProcess = [...map].filter((x) => getAllNeighbours(strToCoord(x), map).length !== 0);
		const moves = [] as { from: string; to: string }[];
		const moveDupes = new Map<string, number>();
		elvesToProcess.forEach((x) => {
			const newDir = getNewDirections(strToCoord(x), map, i);
			if (newDir === null) return;
			const proposed = calculateDir(strToCoord(x), newDir);
			const proposedStr = `${proposed.x},${proposed.y}`;
			moveDupes.set(proposedStr, (moveDupes.get(proposedStr) ?? 0) + 1);
			moves.push({ from: x, to: proposedStr });
		});

		let processed = false;
		moves.forEach((move) => {
			if (moveDupes.get(move.to) === 1) {
				map.delete(move.from);
				map.add(move.to);
				processed = true;
			}
		});

		// console.log("Round", i, moves.length, processed);
		if (!processed) {
			result = i + 1;
			break;
		}
	}

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
