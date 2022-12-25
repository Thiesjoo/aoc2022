import { default as now } from "performance-now";

const units = ["=", "-", "0", "1", "2"];
// Part 1
// ======
// ~3 ms - answer: 2-00=12=21-0=01--000

const part1 = (input: string) => {
	const start = now();
	let result = "";

	const data = input.split("\n").map((x) => {
		return x
			.split("")
			.reverse()
			.reduce((acc, cur, i) => {
				acc += (units.indexOf(cur) - 2) * 5 ** i;
				return acc;
			}, 0);
	});

	const numberToSnu = (n: number): string => {
		if (n === 0) return "";
		const current = Math.floor((n + 2) / 5);
		const next = (n + 2) % 5;

		return numberToSnu(current) + units[next];
	};

	console.log(data, numberToSnu(314159265));
	result = numberToSnu(data.reduce((acc, cur) => acc + cur, 0));
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
