import { default as now } from "performance-now";

type Blueprint = {
	id: number;
	ore_cost: number;
	clay_cost: number;
	obsidian_cost_ore: number;
	obsidian_cost_clay: number;
	geode_cost_ore: number;
	geode_cost_obsidian: number;
};

const hashState = (state: any) => {
	return `${state.ore}:${state.clay}:${state.obsidian}:${state.geode}:${state.robot1}:${state.robot2}:${state.robot3}:${state.robot4}:${state.time}`;
};

function simulate(data: Blueprint, maxTime: number) {
	let queue = [
		{
			ore: 0,
			clay: 0,
			obsidian: 0,
			geode: 0,
			robot1: 1,
			robot2: 0,
			robot3: 0,
			robot4: 0,
			time: maxTime,
		},
	];

	const maxOreCost = Math.max(data.ore_cost, data.clay_cost, data.obsidian_cost_ore, data.geode_cost_ore);

	const PRUNE = 50000 * 3;
	const uniqueStates = new Set<string>();
	let best = 0;
	let currentDepth = maxTime - 1;
	while (queue.length > 0) {
		const current = queue.shift()!;
		if (current.time == currentDepth) {
			if (queue.length > PRUNE) {
				queue.sort((a, b) => {
					return (
						1000 * b.geode +
						100 * b.obsidian +
						10 * b.clay +
						b.ore -
						(1000 * a.geode + 100 * a.obsidian + 10 * a.clay + a.ore)
					);
				});

				/// console.log(queue.length, current.time, "pruning: ", queue.length - PRUNE, "states");
				queue.length = PRUNE;
			}
			currentDepth--;
		}

		if (current.geode > best) {
			best = current.geode;
		}

		if (current.time === 0) {
			continue;
		}

		if (current.robot1 >= maxOreCost) {
			current.robot1 = maxOreCost;
		}
		if (current.robot2 >= data.obsidian_cost_clay) {
			current.robot2 = data.obsidian_cost_clay;
		}
		if (current.robot3 >= data.geode_cost_obsidian) {
			current.robot3 = data.geode_cost_obsidian;
		}
		if (current.ore >= current.time * maxOreCost - current.robot1 * (current.time - 1)) {
			current.ore = current.time * maxOreCost - current.robot1 * (current.time - 1);
		}
		if (current.clay >= current.time * data.obsidian_cost_clay - current.robot2 * (current.time - 1)) {
			current.clay = current.time * data.obsidian_cost_clay - current.robot2 * (current.time - 1);
		}
		if (current.obsidian >= current.time * data.geode_cost_obsidian - current.robot3 * (current.time - 1)) {
			current.obsidian = current.time * data.geode_cost_obsidian - current.robot3 * (current.time - 1);
		}

		const hash = hashState(current);
		if (uniqueStates.has(hash)) {
			continue;
		}
		uniqueStates.add(hash);

		// if (uniqueStates.size % 1000 === 0) {
		// 	console.log("Hash: ", uniqueStates.size, best);
		// }

		queue.push({
			...current,
			time: current.time - 1,
			ore: current.robot1 + current.ore,
			clay: current.robot2 + current.clay,
			obsidian: current.robot3 + current.obsidian,
			geode: current.robot4 + current.geode,
		});

		if (current.ore >= data.ore_cost) {
			queue.push({
				...current,
				time: current.time - 1,
				ore: current.robot1 + current.ore - data.ore_cost,
				clay: current.robot2 + current.clay,
				obsidian: current.robot3 + current.obsidian,
				geode: current.robot4 + current.geode,
				robot1: current.robot1 + 1,
			});
		}
		if (current.ore >= data.clay_cost) {
			queue.push({
				...current,
				time: current.time - 1,
				ore: current.robot1 + current.ore - data.clay_cost,
				clay: current.robot2 + current.clay,
				obsidian: current.robot3 + current.obsidian,
				geode: current.robot4 + current.geode,
				robot2: current.robot2 + 1,
			});
		}
		if (current.ore >= data.obsidian_cost_ore && current.clay >= data.obsidian_cost_clay) {
			queue.push({
				...current,
				time: current.time - 1,
				ore: current.robot1 + current.ore - data.obsidian_cost_ore,
				clay: current.robot2 + current.clay - data.obsidian_cost_clay,
				obsidian: current.robot3 + current.obsidian,
				geode: current.robot4 + current.geode,
				robot3: current.robot3 + 1,
			});
		}
		if (current.ore >= data.geode_cost_ore && current.obsidian >= data.geode_cost_obsidian) {
			queue.push({
				...current,
				time: current.time - 1,
				ore: current.robot1 + current.ore - data.geode_cost_ore,
				clay: current.robot2 + current.clay,
				obsidian: current.robot3 + current.obsidian - data.geode_cost_obsidian,
				geode: current.robot4 + current.geode,
				robot4: current.robot4 + 1,
			});
		}
	}

	// console.log(uniqueStates);

	return best;
}

// Part 1
// ======
// ~401354 ms (aka meer dan 5 minuten lolz) - answer: 1659

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	const data: Blueprint[] = input.split("\n").map((x) => {
		const data = x.split(" ");
		const id = +data[1].split(":")[0];
		console.log(x);
		const ore_cost = +data[6];
		const clay_cost = +data[12];
		const obsidian_cost_ore = +data[18];
		const obsidian_cost_clay = +data[21];

		const geode_cost_ore = +data[27];
		const geode_cost_obsidian = +data[30];

		return { id, ore_cost, clay_cost, obsidian_cost_clay, obsidian_cost_ore, geode_cost_ore, geode_cost_obsidian };
	});

	result = data.reduce((acc, val) => {
		const temp = simulate(val, 24);
		console.log(val, temp);
		acc += temp * val.id;
		return acc;
	}, 0);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// te lang - answer: 6804

const part2 = (input: string) => {
	const start = now();
	let result = 0;

	const data: Blueprint[] = input.split("\n").map((x) => {
		const data = x.split(" ");
		const id = +data[1].split(":")[0];
		console.log(x);
		const ore_cost = +data[6];
		const clay_cost = +data[12];
		const obsidian_cost_ore = +data[18];
		const obsidian_cost_clay = +data[21];

		const geode_cost_ore = +data[27];
		const geode_cost_obsidian = +data[30];

		return { id, ore_cost, clay_cost, obsidian_cost_clay, obsidian_cost_ore, geode_cost_ore, geode_cost_obsidian };
	});

	result = data.slice(0, 2).reduce((acc, val) => {
		const temp = simulate(val, 32);
		console.log(val, temp);
		return acc * temp;
	}, 1);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
