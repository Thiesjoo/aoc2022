import { default as now } from "performance-now";
const OPEN = ".";
const CLOSED = "#";

function mod(n: number, m: number) {
	return ((n % m) + m) % m;
}

const outOfBounds = (newLocation: any, map: any) =>
	newLocation.x < 0 || newLocation.x >= map[0].length || newLocation.y < 0 || newLocation.y >= map.length;

// Part 1
// ======
// ~18 ms - answer: 64256

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	const demo = false;
	const [mapString, instructions] = (` `.repeat(demo ? 8 : 50) + input).split("\n\n");
	const map = mapString.split("\n").map((line) => [...line]);

	const startLocation = map[0].findIndex((x) => x === OPEN);
	let current = { x: startLocation, y: 0 };
	const directions = {
		U: { x: 0, y: -1 },
		D: { x: 0, y: 1 },
		L: { x: -1, y: 0 },
		R: { x: 1, y: 0 },
	};
	const directionsLoop = ["U", "R", "D", "L"] as (keyof typeof directions)[];
	let direction = "R" as keyof typeof directions;

	for (let i = 0; i < instructions.length; i++) {
		const instruction = instructions[i];
		if (instruction === "R") {
			let nowDir = directionsLoop.indexOf(direction);
			nowDir = (nowDir + 1) % directionsLoop.length;
			direction = directionsLoop[nowDir];
		} else if (instruction === "L") {
			// turn left
			let nowDir = directionsLoop.indexOf(direction);
			nowDir = mod(nowDir - 1, directionsLoop.length);
			direction = directionsLoop[nowDir];
		} else {
			let numbers = instruction;
			// Check if next instructions is number
			if (!isNaN(parseInt(instructions[i + 1]))) {
				numbers += instructions[i + 1];
				i++;
			}
			// Move forward
			const steps = +numbers;
			step: for (let j = 0; j < steps; j++) {
				let newLocation = { x: current.x + directions[direction].x, y: current.y + directions[direction].y };

				if (!outOfBounds(newLocation, map) && map[newLocation.y][newLocation.x] === OPEN) {
					current = newLocation;
				} else if (outOfBounds(newLocation, map) || map[newLocation.y][newLocation.x] !== CLOSED) {
					newLocation = { x: current.x, y: current.y };
					while (
						!outOfBounds(newLocation, map) &&
						map[newLocation.y][newLocation.x] !== " " &&
						map[newLocation.y][newLocation.x] !== undefined
					) {
						newLocation.x -= directions[direction].x;
						newLocation.y -= directions[direction].y;
					}
					newLocation.x += directions[direction].x;
					newLocation.y += directions[direction].y;
					if (map[newLocation.y][newLocation.x] === "#") {
						break;
					}
					current = newLocation;
				}
			}
		}
	}

	const scores = {
		R: 0,
		D: 1,
		L: 2,
		U: 3,
	};
	const final = { row: current.y + 1, col: current.x + 1, facing: scores[direction] };

	result = final.row * 1000 + 4 * final.col + final.facing;
	console.log("Final location", final);

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

	const demo = false;
	const [mapString, instructions] = (` `.repeat(demo ? 8 : 50) + input).split("\n\n");
	const map = mapString.split("\n").map((line) => [...line]);

	const startLocation = map[0].findIndex((x) => x === OPEN);
	let current = { x: startLocation, y: 0 };
	const directions = {
		U: { x: 0, y: -1 },
		D: { x: 0, y: 1 },
		L: { x: -1, y: 0 },
		R: { x: 1, y: 0 },
	};
	const directionsLoop = ["U", "R", "D", "L"] as (keyof typeof directions)[];
	let direction = "R" as keyof typeof directions;

	for (let i = 0; i < instructions.length; i++) {
		const instruction = instructions[i];
		if (instruction === "R") {
			let nowDir = directionsLoop.indexOf(direction);
			nowDir = (nowDir + 1) % directionsLoop.length;
			direction = directionsLoop[nowDir];
		} else if (instruction === "L") {
			// turn left
			let nowDir = directionsLoop.indexOf(direction);
			nowDir = mod(nowDir - 1, directionsLoop.length);
			direction = directionsLoop[nowDir];
		} else {
			let numbers = instruction;
			// Check if next instructions is number
			if (!isNaN(parseInt(instructions[i + 1]))) {
				numbers += instructions[i + 1];
				i++;
			}

			const steps = +numbers;
			step: for (let j = 0; j < steps; j++) {
				let newLocation = { x: current.x + directions[direction].x, y: current.y + directions[direction].y };

				if (!outOfBounds(newLocation, map) && map[newLocation.y][newLocation.x] === OPEN) {
					current = newLocation;
				} else if (outOfBounds(newLocation, map) || map[newLocation.y][newLocation.x] !== CLOSED) {
					if (!outOfBounds(newLocation, map) && map[newLocation.y][newLocation.x] === "#") {
						break;
					}

					const { x: px, y: py } = current;
					let ny = -1;
					let nx = -1;
					let nfacing = -1;

					switch (direction) {
						case "R": //right
							if (py <= 50) {
								nfacing = 2;
								ny = 151 - py;
								nx = 100;
							} else if (py <= 100) {
								nfacing = 3;
								ny = 50;
								nx = 50 + py;
							} else if (py <= 150) {
								nfacing = 2;
								ny = 151 - py;
								nx = 150;
							} else {
								nfacing = 3;
								ny = 150;
								nx = py - 100;
							}
							break;
						case "D": //down
							if (px <= 50) {
								nfacing = 1;
								ny = 1;
								nx = px + 100;
							} else if (px <= 100) {
								nfacing = 2;
								ny = px + 100;
								nx = 50;
							} else {
								nfacing = 2;
								ny = px - 50;
								nx = 100;
							}
							break;
						case "L": //left
							if (py <= 50) {
								nfacing = 0;
								ny = 151 - py;
								nx = 1;
							} else if (py <= 100) {
								nfacing = 1;
								ny = 101;
								nx = py - 50;
							} else if (py <= 150) {
								nfacing = 0;
								ny = 151 - py;
								nx = 51;
							} else {
								nfacing = 1;
								ny = 1;
								nx = py - 100;
							}
							break;
						case "U": //up
							if (px <= 50) {
								nfacing = 0;
								ny = px + 50;
								nx = 51;
							} else if (px <= 100) {
								nfacing = 0;
								ny = px + 100;
								nx = 1;
							} else {
								nfacing = 3;
								ny = 200;
								nx = px - 100;
							}
							break;
					}

					if (map[ny][nx] === CLOSED) {
						break;
					}
					if (map[ny][nx] === OPEN) {
						const test = ["R", "D", "L", "U"] as ("R" | "D" | "L" | "U")[];
						direction = test[nfacing];
						current = { x: nx, y: ny };
					}
				}
			}

			console.assert(false);
		}
	}
	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
