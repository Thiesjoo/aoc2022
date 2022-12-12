import { default as now } from "performance-now";

function locFromMap(map: string[][], loc: { x: number; y: number }) {
	return map[loc.y][loc.x];
}

function compareChars(map: string[][], loc1: { x: number; y: number }, loc2: { x: number; y: number }) {
	// Check if we are out of bounds
	if (loc1.x < 0 || loc1.x >= map[0].length || loc1.y < 0 || loc1.y >= map.length) {
		return false;
	}

	if (loc2.x < 0 || loc2.x >= map[0].length || loc2.y < 0 || loc2.y >= map.length) {
		return false;
	}

	let chars1 = locFromMap(map, loc1);
	let chars2 = locFromMap(map, loc2);
	if (chars2 === "E") {
		chars2 = "z";
	}
	if (chars1 === "S") {
		chars1 = "a";
	}

	console.log(chars1, chars2, chars1.charCodeAt(0) + 1 >= chars2.charCodeAt(0));

	return chars1.charCodeAt(0) + 1 >= chars2.charCodeAt(0);
}

// Part 1
// ======
// ~0 ms - answer: 0

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	const data = input.split("\n").map((x) => x.split(""));
	console.log(data);

	let startPos = { x: 0, y: 0 };
	let endPos = { x: 0, y: 0 };

	data.forEach((x, i) => {
		x.forEach((y, j) => {
			if (y === "E") {
				endPos.x = j;
				endPos.y = i;
			} else if (y === "S") {
				startPos.x = j;
				startPos.y = i;
			}
		});
	});

	console.log(startPos, endPos);

	const visited = new Set<string>();
	const queue = [{ location: startPos, length: 0 }];
	while (queue.length > 0) {
		let { location: current, length } = queue.shift()!;

		console.log("current", current, length);
		if (current.x === endPos.x && current.y === endPos.y) {
			console.log("reached the end");
			console.log(length);
			break;
		}

		let next = [
			{ x: current.x + 1, y: current.y },
			{ x: current.x - 1, y: current.y },
			{ x: current.x, y: current.y + 1 },
			{ x: current.x, y: current.y - 1 },
		].filter((x) => {
			if (visited.has(`${x.x},${x.y}`)) {
				return false;
			}
			return compareChars(data, current, x);
		});

		next.forEach((x) => {
			visited.add(`${x.x},${x.y}`);
			queue.push({ location: x, length: length + 1 });
		});
	}

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
