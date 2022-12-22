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
// ~0 ms - answer: 0

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	const demo = false;
	const [mapString, instructions] = (` `.repeat(demo ? 8 : 50) + input).split("\n\n");
	const map = mapString.split("\n").map((line) => [...line]);

	console.log(map[0]);

	const startLocation = map[0].findIndex((x) => x === OPEN);
	let current = { x: startLocation, y: 0 };
	console.log("start location", current);
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
			console.log("Switched right");
		} else if (instruction === "L") {
			// turn left
			let nowDir = directionsLoop.indexOf(direction);
			nowDir = mod(nowDir - 1, directionsLoop.length);
			direction = directionsLoop[nowDir];
			console.log("Switched left");
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
					console.log("new location", current);
				} else if (outOfBounds(newLocation, map) || map[newLocation.y][newLocation.x] !== CLOSED) {
					console.log(direction, "Should wrap around", newLocation, current);
					newLocation = { x: current.x, y: current.y };
					while (
						!outOfBounds(newLocation, map) &&
						map[newLocation.y][newLocation.x] !== " " &&
						map[newLocation.y][newLocation.x] !== undefined
					) {
						console.log(newLocation, map[newLocation.y][newLocation.x]);
						newLocation.x -= directions[direction].x;
						newLocation.y -= directions[direction].y;
					}
					newLocation.x += directions[direction].x;
					newLocation.y += directions[direction].y;
					if (map[newLocation.y][newLocation.x] === "#") {
						console.log("Hit a wall", newLocation);
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

	const data = input.split("\n");
	console.log(data);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
