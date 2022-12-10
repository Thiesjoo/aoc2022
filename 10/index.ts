import { default as now } from "performance-now";

// Part 1
// ======
// ~0 ms - answer: 11960

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	const data = input.split("\n");

	let signalStrenghts = [] as number[];
	let measurePoints = [20, 60, 100, 140, 180, 220];
	let registerX = 1;
	let cycleCount = 0;
	data.forEach((x) => {
		cycleCount += 1;
		if (measurePoints.includes(cycleCount)) {
			signalStrenghts.push(registerX * cycleCount);
		}

		if (x === "noop") {
		} else {
			cycleCount += 1;
			if (measurePoints.includes(cycleCount)) {
				console.log("Signal middle", registerX * cycleCount, "at", cycleCount, "cycles");
			}

			const amount = parseInt(x.split(" ")[1]);
			registerX += amount;
		}
	});
	result = signalStrenghts.reduce((acc, val) => acc + val, 0);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~0.3 ms - answer: EJCFPGLH

const part2 = (input: string) => {
	const start = now();
	let result = 0;

	const data = input.split("\n");

	const SCREEN_WIDTH = 40;
	const SCREEN_HEIGHT = 6;
	const CRT: (string | null)[][] = Array.from({ length: SCREEN_HEIGHT }, () =>
		Array.from({ length: SCREEN_WIDTH }, () => null)
	);

	let registerX = 1;
	let cycleCount = 0;
	function draw() {
		const drawintTo = cycleCount - 1;
		const [col, row] = [drawintTo % SCREEN_WIDTH, Math.floor(drawintTo / SCREEN_WIDTH)];

		CRT[row][col] = col >= registerX - 1 && col <= registerX + 1 ? "#" : ".";
	}

	data.forEach((x) => {
		cycleCount += 1;
		draw();

		if (x === "noop") {
		} else {
			cycleCount += 1;
			draw();

			const amount = parseInt(x.split(" ")[1]);
			registerX += amount;
		}
	});

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	console.log(CRT.map((x) => x.join("")).join("\n"));

	return result;
};

export { part1, part2 };
