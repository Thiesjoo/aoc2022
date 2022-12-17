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
	const MAX_ROCKS = 1000000000000;
	let max_h = -1;
	let curr_jet = 0;

	let added = 0;

	const data = input.split("");
	const map = new Set<string>();
	let done = false;

	const gameStates = new Map<string, { prevT: number; prevX: number }>();

	for (let i = 0; i < MAX_ROCKS; i++) {
		// Generate a skyline of the current rocks (max 30 high)
		let skyLine = Array.from({ length: WIDTH }, (_, i) => {
			return i;
		}).flatMap((x) => {
			let coords: [number, number][] = [];
			for (let i = max_h; i > max_h - 30; i--) {
				if (map.has(`${x},${i}`)) {
					coords.push([x, i]);
				}
			}
			return coords;
		});

		// Make it relative to the highest rock
		const maxSkyline = Math.max(...skyLine.map((x) => x[1]));
		skyLine = skyLine.map((x) => [x[0], x[1] - maxSkyline]);

		const indexing = `${i % rocks.length},${curr_jet % data.length},${JSON.stringify(skyLine)}`;
		if (gameStates.has(indexing) && i > 2022 && !done) {
			const { prevT, prevX } = gameStates.get(indexing)!;
			const diff = i - prevT;
			const diffX = max_h - prevX;

			// We do not want to go over the trillionth rock, so we floor it here.
			const loop = Math.floor((MAX_ROCKS - i) / diff);
			i += loop * diff;

			// Do not update max_h, because that would require many modifications to the map set.
			added += loop * diffX;

			done = true;
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
	}

	result = max_h + added + 1;
	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
