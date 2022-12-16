import { default as now } from "performance-now";

// Part 1
// ======
// ~23 ms - answer: 728

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	const allPoints = new Set<string>();
	let lowestY = 0;

	input.split("\n").forEach((x) => {
		const points = x.split(" -> ");
		for (let i = 1; i < points.length; i++) {
			const [startX, startY] = points[i - 1].split(",").map(Number);
			const [endX, endY] = points[i].split(",").map(Number);

			for (let x = Math.min(startX, endX); x <= Math.max(startX, endX); x++) {
				for (let y = Math.min(startY, endY); y <= Math.max(startY, endY); y++) {
					allPoints.add(`${x},${y}`);
					lowestY = Math.max(lowestY, y);
				}
			}
		}
	});

	let fell = true;
	let count = 0;
	while (fell && count < 1000) {
		fell = false;

		// Spawn sand
		const current = [500, 0];

		while (current[1] <= lowestY) {
			const point = `${current[0]},${current[1] + 1}`;
			if (allPoints.has(point)) {
				// Check down and left
				const downLeft = `${current[0] - 1},${current[1] + 1}`;
				if (allPoints.has(downLeft)) {
					const downRight = `${current[0] + 1},${current[1] + 1}`;
					if (allPoints.has(downRight)) {
						break;
					}
					current[0]++;
				} else {
					current[0]--;
				}
			}
			fell = true;
			current[1]++;
		}

		if (current[1] > lowestY) {
			console.log("reached the end", count);
			break;
		}

		if (fell) {
			allPoints.add(`${current[0]},${current[1]}`);
			count++;
		}
	}

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~1600  ms - answer:27623

const part2 = (input: string) => {
	const start = now();
	let result = 0;

	const allPoints = new Set<string>();
	let lowestY = 0;

	input.split("\n").forEach((x) => {
		const points = x.split(" -> ");
		for (let i = 1; i < points.length; i++) {
			const [startX, startY] = points[i - 1].split(",").map(Number);
			const [endX, endY] = points[i].split(",").map(Number);

			for (let x = Math.min(startX, endX); x <= Math.max(startX, endX); x++) {
				for (let y = Math.min(startY, endY); y <= Math.max(startY, endY); y++) {
					allPoints.add(`${x},${y}`);
					lowestY = Math.max(lowestY, y);
				}
			}
		}
	});

	const floor = lowestY + 2;

	// hehe
	for (let x = -1000000; x < 1000000; x++) {
		allPoints.add(`${x},${floor}`);
	}

	let fell = true;
	let count = 0;
	while (fell) {
		fell = false;

		// Spawn sand
		const current = [500, 0];

		while (1) {
			const point = `${current[0]},${current[1] + 1}`;
			if (allPoints.has(point)) {
				// Check down and left
				const downLeft = `${current[0] - 1},${current[1] + 1}`;
				if (allPoints.has(downLeft)) {
					const downRight = `${current[0] + 1},${current[1] + 1}`;
					if (allPoints.has(downRight)) {
						break;
					}
					current[0]++;
				} else {
					current[0]--;
				}
			}
			fell = true;
			current[1]++;
		}

		if (fell) {
			allPoints.add(`${current[0]},${current[1]}`);
			count++;
		}
	}
	result = count + 1;
	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
