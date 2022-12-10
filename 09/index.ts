import { default as now } from "performance-now";

const DIR = {
	R: { x: 1, y: 0 },
	L: { x: -1, y: 0 },
	U: { x: 0, y: 1 },
	D: { x: 0, y: -1 },
} as { [key: string]: { x: number; y: number } };

// Part 1
// ======
// ~13 ms - answer: 6018

function follow(toFollow: { x: number; y: number }, rope: { x: number; y: number }): { x: number; y: number } {
	let x = rope.x;
	let y = rope.y;

	// Check if touching in all 9 sides
	// If so, return the current position
	// If not, move one step in the direction of the target

	const touching = [
		{ x: x - 1, y: y },
		{ x: x - 1, y: y + 1 },
		{ x: x - 1, y: y - 1 },
		{ x: x, y: y },
		{ x: x, y: y + 1 },
		{ x: x, y: y - 1 },
		{ x: x + 1, y: y },
		{ x: x + 1, y: y + 1 },
		{ x: x + 1, y: y - 1 },
	].some((x) => x.x === toFollow.x && x.y === toFollow.y);

	if (touching) {
		return { x, y };
	}

	// Move 1 step
	if (toFollow.x > x) {
		x += 1;
	}
	if (toFollow.x < x) {
		x -= 1;
	}
	if (toFollow.y > y) {
		y += 1;
	}
	if (toFollow.y < y) {
		y -= 1;
	}

	return { x, y };
}

function simulate(input: string, knots = 2) {
	const data = input.split("\n").map((x) => {
		const [dir, ...rest] = x.split("");
		return { dir, amount: parseInt(rest.join("")) };
	});
	const visited = new Set<string>();

	const rope = Array.from({ length: knots }, () => {
		return { x: 0, y: 0 };
	});

	visited.add(`${rope[0].x},${rope[0].y}`);
	data.forEach((x) => {
		for (let i = 0; i < x.amount; i++) {
			rope[0].x += DIR[x.dir].x;
			rope[0].y += DIR[x.dir].y;

			for (let j = 1; j < knots; j++) {
				rope[j] = follow(rope[j - 1], rope[j]);
			}
			visited.add(`${rope[rope.length - 1].x},${rope[rope.length - 1].y}`);
		}
	});
	return visited.size;
}

const part1 = (input: string) => {
	const start = now();
	let result = simulate(input, 2);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~26 ms - answer: 2619

const part2 = (input: string) => {
	const start = now();
	let result = simulate(input, 10);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
