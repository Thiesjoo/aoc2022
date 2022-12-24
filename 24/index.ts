import { default as now } from "performance-now";
enum Blizzard {
	Nothing = 0,
	Up = 1,
	Left = 2,
	Down = 4,
	Right = 8,
}

function parseInput(input: string): Blizzard[][] {
	let map = [] as Blizzard[][];
	const maxRow = input.split("\n").length - 1;
	input.split("\n").forEach((line, j) => {
		if (j === 0 || j === maxRow) return;
		map.push([]);
		for (let i = 1; i < line.length - 1; i++) {
			const char = line[i];
			if (char === ".") {
				map[map.length - 1].push(Blizzard.Nothing);
			} else if (char === ">") {
				map[map.length - 1].push(Blizzard.Right);
			} else if (char === "<") {
				map[map.length - 1].push(Blizzard.Left);
			} else if (char === "^") {
				map[map.length - 1].push(Blizzard.Up);
			} else if (char === "v") {
				map[map.length - 1].push(Blizzard.Down);
			}
		}
	});
	return map;
}

function progressMap(map: Blizzard[][]) {
	let newMap: Blizzard[][] = [];
	for (let row = 0; row < map.length; row++) {
		newMap.push(new Array(map[row].length).fill(Blizzard.Nothing));
	}
	for (let row = 0; row < map.length; row++) {
		for (let column = 0; column < map[0].length; column++) {
			let blizzardFlag = map[row][column];
			if (blizzardFlag !== Blizzard.Nothing) {
				if (blizzardFlag & Blizzard.Left) {
					const newColumn = (column - 1 + map[0].length) % map[0].length;
					newMap[row][newColumn] |= Blizzard.Left;
				}
				if (blizzardFlag & Blizzard.Up) {
					const newRow = (row - 1 + map.length) % map.length;
					newMap[newRow][column] |= Blizzard.Up;
				}
				if (blizzardFlag & Blizzard.Down) {
					const newRow = (row + 1) % map.length;
					newMap[newRow][column] |= Blizzard.Down;
				}
				if (blizzardFlag & Blizzard.Right) {
					const newColumn = (column + 1) % map[0].length;
					newMap[row][newColumn] |= Blizzard.Right;
				}
			}
		}
	}
	return newMap;
}
const get = ({ x, y }: { x: number; y: number }, map: Blizzard[][]) => map[y][x];

const pathFind = (map: Blizzard[][], toStart = false) => {
	let queue = [] as { x: number; y: number }[];
	let minutes = 0;
	console.log("Initial map");
	console.log(map);
	while (true) {
		minutes++;
		map = progressMap(map);
		if (toStart) {
			if (map[map.length - 1][map[0].length - 1] === Blizzard.Nothing) {
				queue.push({ x: map[0].length - 1, y: map.length - 1 });
			}
		} else {
			if (map[0][0] === Blizzard.Nothing) {
				queue.push({ x: 0, y: 0 });
			}
		}

		const visited = new Set<string>();
		const newQueue = [] as { x: number; y: number }[];

		for (const x of queue) {
			if (visited.has(`${x.x},${x.y}`)) continue;
			if (toStart) {
				if (x.x === 0 && x.y === 0) {
					return { minutes, map };
				}
			} else {
				if (x.x === map[0].length - 1 && x.y === map.length - 1) {
					return { minutes, map };
				}
			}
			visited.add(`${x.x},${x.y}`);

			const up = { x: x.x, y: x.y - 1 };
			const down = { x: x.x, y: x.y + 1 };
			const left = { x: x.x - 1, y: x.y };
			const right = { x: x.x + 1, y: x.y };

			const possible = [x, up, down, left, right];
			possible
				.filter(
					(p) =>
						p.x >= 0 &&
						p.x < map[0].length &&
						p.y >= 0 &&
						p.y < map.length &&
						get(p, map) === Blizzard.Nothing
				)
				.forEach((p) => {
					newQueue.push(p);
				});
		}

		queue = newQueue;
	}
};

// Part 1
// ======
// ~0 ms - answer: 282

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	let map = parseInput(input);
	result = pathFind(map).minutes;

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

	let map = parseInput(input);
	let { map: newMap, minutes } = pathFind(map, false);
	let { map: newMap2, minutes: min2 } = pathFind(newMap, true);
	let { map: newMap3, minutes: min3 } = pathFind(newMap2, false);
	console.log(minutes, min2, min3);
	result = minutes + min2 + min3;

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
