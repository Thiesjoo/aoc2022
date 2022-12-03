import { default as now } from "performance-now";

function mapToPrio(a: string): number {
	const code = a.charCodeAt(0);
	if (code >= "a".charCodeAt(0) && code <= "z".charCodeAt(0)) {
		return code - "a".charCodeAt(0) + 1;
	}
	if (code >= "A".charCodeAt(0) && code <= "Z".charCodeAt(0)) {
		return code - "A".charCodeAt(0) + 1 + 26;
	}

	return -1;
}

// Part 1
// ======
// ~2 ms - answer: 8240

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	const data = input.split("\n").map((x) => {
		const firstPart = new Set(x.slice(0, x.length / 2));
		const secondPart = new Set(x.slice(x.length / 2));

		let [matching] = new Set([...firstPart].filter((x) => secondPart.has(x)));
		return matching;
	});

	result = data.reduce((acc, val) => acc + mapToPrio(val), 0);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~1.6 ms - answer: 2587

const part2 = (input: string) => {
	const start = now();
	let result = 0;

	let part = 0;
	let list: string[] = [];

	const data = input
		.split("\n")
		.map((x) => {
			if (part !== 2) {
				list.push(x);
				part++;
				return null;
			} else {
				list.push(x);
				const sets = list.map((x) => new Set(x));

				let [matching] = new Set([...sets[0]].filter((x) => sets[1].has(x) && sets[2].has(x)));

				list = [];
				part = 0;
				return matching;
			}
		})
		.filter((x) => x !== null);

	result = data.reduce((acc, val) => acc + mapToPrio(val as string), 0);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
