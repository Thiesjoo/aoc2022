import { default as now } from "performance-now";

// Hehe this is not cheating rigghhttttt

//@ts-ignore
import v8 from "v8";
v8.setFlagsFromString("--stack-size=20000");

const BFS = (start: string, end: string, graph: Map<string, string[]>) => {
	let queue = [] as string[][];
	let visited = new Set<string>();

	if (start === end) {
		return [start];
	}

	queue.push([start]);

	while (queue.length > 0) {
		let path = queue.shift()!;
		let node = path[path.length - 1];

		if (!visited.has(node)) {
			visited.add(node);
			let neighbors = graph.get(node)!;
			for (let i = 0; i < neighbors.length; i++) {
				let neighbor = neighbors[i];
				if (neighbor === end) {
					return path.concat(neighbor);
				} else {
					queue.push(path.concat(neighbor));
				}
			}
		}
	}

	return [];
};

const constructDistanceMap = (graph: Map<string, string[]>) => {
	const distanceMap = new Map<string, number>();
	[...graph.keys()].forEach((start) => {
		[...graph.keys()].forEach((end) => {
			if (!distanceMap.has(`${start}-${end}`)) {
				const path = BFS(start, end, graph);
				distanceMap.set(`${start}-${end}`, path.length - 1);
			}
		});
	});
	return distanceMap;
};

const parseInput = (input: string) => {
	let graph = new Map<string, string[]>();
	let flowRates = new Map<string, number>();

	const interestingNodes = new Set<string>();

	input.split("\n").forEach((x) => {
		const [_, valve, __, ___, flowRate, ____, _____, ______, _______, ...tunnels] = x.split(" ");
		const rate = +flowRate.split("=")[1].replace(";", "");

		graph.set(
			valve,
			tunnels.map((x) => x.replace(",", ""))
		);
		flowRates.set(valve, rate);

		if (rate > 0) interestingNodes.add(valve);
	});
	return { graph, flowRates, interestingNodes };
};

function rates(
	distanceMap: Map<string, number>,
	current: string,
	minutesLeft: number,
	nodesLeft: string[],
	opened = {} as { [key: string]: number }
) {
	const allRates = [opened];

	for (let i = 0; i < nodesLeft.length; i++) {
		const x = nodesLeft[i];

		let minutesLeftIfTraveled = minutesLeft - distanceMap.get(`${current}-${x}`)! - 1;
		if (minutesLeftIfTraveled < 1) {
			continue;
		}

		let newOpened = { ...opened };
		newOpened[x] = minutesLeftIfTraveled;

		const newNodesLeft = [...nodesLeft];
		newNodesLeft.splice(i, 1);
		allRates.push(...rates(distanceMap, x, minutesLeftIfTraveled, newNodesLeft, newOpened));
	}

	return allRates;
}

// Part 1
// ======
// ~822 ms - answer: 2056

const part1 = (input: string) => {
	const start = now();

	const { graph, flowRates, interestingNodes } = parseInput(input);
	const distanceMap = constructDistanceMap(graph);
	const allRates = rates(distanceMap, "AA", 30, [...interestingNodes]);

	const maxPressure = allRates.map((x) =>
		Object.entries(x).reduce((a, [node, minute]) => a + minute * flowRates.get(node)!, 0)
	);

	maxPressure.sort((a, b) => b - a);
	let result = maxPressure[0];

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~16000 ms - answer: 2513

const part2 = (input: string) => {
	const start = now();
	let result = 0;

	const { graph, flowRates, interestingNodes } = parseInput(input);
	const distanceMap = constructDistanceMap(graph);
	const allRates = rates(distanceMap, "AA", 26, [...interestingNodes]);

	const getScoreForPath = (path: { [key: string]: number }) => {
		return Object.entries(path).reduce((acc, [key, value]) => acc + flowRates.get(key)! * value, 0);
	};

	const maxScoreForPath = {} as { [key: string]: number };

	allRates.forEach((x) => {
		const path = Object.keys(x).sort().join("-");
		if (!maxScoreForPath[path]) {
			maxScoreForPath[path] = -10000000;
		}
		maxScoreForPath[path] = Math.max(maxScoreForPath[path], getScoreForPath(x));
	});

	Object.keys(maxScoreForPath).forEach((path1) => {
		Object.keys(maxScoreForPath).forEach((path2) => {
			// Check if there is no intersection between path1 and path2
			const path1Split = path1.split("-");
			const path2Split = path2.split("-");
			const intersection = path1Split.some((x) => path2Split.includes(x));

			if (!intersection) {
				result = Math.max(result, maxScoreForPath[path1] + maxScoreForPath[path2]);
			}
		});
	});

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
