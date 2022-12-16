import { default as now } from "performance-now";

// Part 1
// ======
// ~0 ms - answer: 0

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	let graph = new Map<string, string[]>();
	let flowRates = new Map<string, number>();

	const interestingNodes = new Set<string>(["AA"]);

	input.split("\n").forEach((x) => {
		// Write a regex to match this example:
		// Valve JJ has flow rate=21; tunnel leads to valve II, DD

		// Then use the regex to extract the data
		// Then use the data to build the graph

		const [_, valve, __, ___, flowRate, ____, _____, ______, _______, ...tunnels] = x.split(" ");
		const rate = +flowRate.split("=")[1].replace(";", "");

		graph.set(
			valve,
			tunnels.map((x) => x.replace(",", ""))
		);
		flowRates.set(valve, rate);

		if (rate > 0) {
			interestingNodes.add(valve);
		}
	});
	console.log(flowRates, graph, interestingNodes);

	// Plan of attack

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
