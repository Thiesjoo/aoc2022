import { default as now } from "performance-now";

const rocks = [
	// ####
	[
		[0, 0],
		[1, 0],
		[2, 0],
		[3, 0],
	],
	[
		[1, 0],
		[1, 1],
		[0, 1],
		[2, 1],
		[1, 2],
	],
	[
		[2, 2],
		[2, 1],
		[2, 0],
		[1, 0],
		[0, 0],
	],
	[
		[0, 0],
		[0, 1],
		[0, 2],
		[0, 3],
	],
	[
		[0, 0],
		[0, 1],
		[1, 0],
		[1, 1],
	],
];

// Part 1
// ======
// ~40 ms - answer: 3117

const part1 = (input: string) => {
	const start = now();
	let result = 0;
	const WIDTH = 7;
	const MAX_ROCKS = 2022;
	let max_h = -1;
	let curr_jet = 0;

	const data = input.split("");
	const map = new Set<string>();

	for (let i = 0; i < MAX_ROCKS; i++) {
		let currentRock = rocks[i % rocks.length].map((x) => {
			return [x[0] + 2, x[1] + max_h + 4];
		});

		while (true) {
			let jet = data[curr_jet++ % data.length];
			let newRock = currentRock.map((x) => {
				return [x[0] + (jet === ">" ? 1 : -1), x[1]];
			});

			let isColliding = newRock.some((x) => {
				return x[0] < 0 || x[0] >= WIDTH || map.has(`${x[0]},${x[1]}`);
			});
			if (!isColliding) currentRock = newRock;

			newRock = currentRock.map((x) => {
				return [x[0], x[1] - 1];
			});

			const finished = newRock.some((x) => {
				return x[1] < 0 || map.has(`${x[0]},${x[1]}`);
			});

			if (finished) {
				currentRock.forEach((x) => {
					map.add(`${x[0]},${x[1]}`);
					if (x[1] > max_h) max_h = x[1];
				});
				break;
			} else {
				currentRock = newRock;
			}
		}
	}

	// Bro wat, waarom +1 america explain
	result = max_h + 1;

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

	const WIDTH = 7;
	const MAX_ROCKS = 500000000;
	let max_h = -1;
	let max_hm = 0;
	let curr_jet = 0;

	const data = input.split("");
	const map = new Set<string>();

	const gameStates = new Map<string, { prevT: number; prevX: number }>();

	for (let i = 0; i < MAX_ROCKS; i++) {
		// // Get the highest point in every column
		let skyLine = Array.from({ length: WIDTH }, (_, i) => {
			let h = max_h;
			while (h > 0 && !map.has(`${i},${h}`)) h--;
			return h;
		}).map((x) => x - max_h);

		// skyLine = skyLine.map((x) => x - Math.max(...skyLine));
		const indexing = `${i % rocks.length},${curr_jet % data.length},${skyLine}`;
		if (gameStates.has(indexing)) {
			const { prevT, prevX } = gameStates.get(indexing)!;
			console.log(prevT, prevX);
			const diff = i - prevT;
			const diffX = max_h - prevX;
			const loop = Math.floor((MAX_ROCKS - i) / diff);
			// break;
			i += loop * diff;
			max_h += loop * diffX;
		} else {
			gameStates.set(indexing, { prevT: i, prevX: max_h });
		}

		let currentRock = rocks[i % rocks.length].map((x) => {
			return [x[0] + 2, x[1] + max_h + 4];
		});

		while (true) {
			let jet = data[curr_jet++ % data.length];
			let newRock = currentRock.map((x) => {
				return [x[0] + (jet === ">" ? 1 : -1), x[1]];
			});

			let isColliding = newRock.some((x) => {
				return x[0] < 0 || x[0] >= WIDTH || map.has(`${x[0]},${x[1]}`);
			});
			if (!isColliding) currentRock = newRock;

			newRock = currentRock.map((x) => {
				return [x[0], x[1] - 1];
			});

			const finished = newRock.some((x) => {
				return x[1] < 0 || map.has(`${x[0]},${x[1]}`);
			});

			if (finished) {
				currentRock.forEach((x) => {
					map.add(`${x[0]},${x[1]}`);
					if (x[1] > max_h) max_h = x[1];
				});
				break;
			} else {
				currentRock = newRock;
			}
		}

		// if (max_h > 100) {
		// 	max_h -= 30;
		// 	max_hm++;
		// }
	}

	// Bro wat, waarom +1 america explain
	// result = max_hm * 30 + max_h + 1 + 1560919511228;

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
