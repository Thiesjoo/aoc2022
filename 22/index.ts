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
			for (let j = 0; j < steps; j++) {
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
// ~0 ms - answer: 109224

// Code is very trashy. There is a bug ✨"somewhere"✨
// I used another program to find the actual answer, and i'm too lazy to fix this code
// Every transistion looks good, but idk

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
			for (let j = 0; j < steps; j++) {
				let newLocation = { x: current.x + directions[direction].x, y: current.y + directions[direction].y };
				if (!outOfBounds(newLocation, map) && map[newLocation.y][newLocation.x] === OPEN) {
					current = newLocation;
				} else if (outOfBounds(newLocation, map) || map[newLocation.y][newLocation.x] !== CLOSED) {
					if (!outOfBounds(newLocation, map) && map[newLocation.y][newLocation.x] === "#") {
						break;
					}

					const backupCurrent = { ...current };
					const backupDirection = direction as any;

					// Identify CURRENT quadrant
					const quadrantX = Math.floor(current.x / 50);
					const quadrantY = Math.floor(current.y / 50);
					console.log("Our current quadrant is", quadrantX, quadrantY);
					const test = {
						// Part 1
						"1,0,U": () => {
							current.y = current.x - 50 + 150;
							current.x = 0;
							direction = "R";
						},
						"0,3,L": () => {
							current.x = current.y - 150 + 50;
							current.y = 0;
							direction = "D";
						},
						// Part 2
						"1,0,L": () => {
							current.x = 0;
							current.y += 100;
							direction = "R";
						},
						"0,2,L": () => {
							current.y -= 100;
							current.x = 50;
							direction = "R";
						},
						// Part 3:
						"0,2,U": () => {
							current.y = current.x + 50;
							current.x = 50;
							direction = "R";
						},
						"1,1,L": () => {
							current.x = current.y - 50;
							current.y = 100;
							direction = "D";
						},
						// Part 4:
						"1,1,R": () => {
							current.x = current.y - 50 + 100;
							current.y = 49;
							direction = "U";
						},
						"2,0,D": () => {
							current.y = current.x - 100 + 50;
							current.x = 99;
							direction = "L";
						},
						// Part 5:
						"2,0,R": () => {
							current.x -= 50;
							current.y += 100;
							direction = "L";
						},
						"1,2,R": () => {
							current.x += 50;
							current.y -= 100;
							direction = "L";
						},

						// Part 6:
						"1,2,D": () => {
							current.y = current.x - 50 + 150;
							current.x = 49;
							direction = "L";
						},
						"0,3,R": () => {
							current.x = current.y - 150 + 50;
							current.y = 149;
							direction = "U";
						},
						// Part 7:
						"2,0,U": () => {
							current.y += 199;
							current.x -= 100;
						},
						"0,3,D": () => {
							current.y -= 199;
							current.x += 100;
						},
					} as { [key: string]: () => void };

					const dir = test[`${quadrantX},${quadrantY},${direction}`];
					console.log(`Trying ${quadrantX},${quadrantY},${direction}`);
					dir();

					if (map[current.y][current.x] !== OPEN) {
						console.log("collided", map[current.y][current.x]);
						direction = backupDirection;
						current = backupCurrent;
					}
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

export { part1, part2 };
