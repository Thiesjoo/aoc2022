import { default as now } from "performance-now";

// Part 1
// ======
// ~0 ms - answer: 55458

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	const data = input.split("\n\n").map((x) => {
		const regex =
			/Monkey (\d+):\s+Starting items: ((?:\d+(?:, |))+)\s+Operation: (.+)\s+Test: divisible by (\d+)\s+If true: throw to monkey (\d+)\s+If false: throw to monkey (\d+)/g.exec(
				x
			);
		const [monkeyId, startingItemsComma, operation, test, throwToIfTrue, throwToIfFalse] = regex?.slice(1) ?? [];
		return {
			monkeyId: Number(monkeyId),
			items: startingItemsComma.split(", ").map(Number),
			operation: operation.replace("new", "newItem"),
			test: Number(test),
			throwToIfTrue: Number(throwToIfTrue),
			throwToIfFalse: Number(throwToIfFalse),
		};
	});

	const inspected: { [key: string]: number } = {};

	for (let i = 0; i < 20; i++) {
		console.log("Round", i);
		data.forEach((monkey) => {
			monkey.items = monkey.items.filter((item) => {
				if (!inspected[monkey.monkeyId]) {
					inspected[monkey.monkeyId] = 0;
				}
				inspected[monkey.monkeyId]++;
				// Only used in eval
				let old = item;
				let newItem = 0;
				eval(monkey.operation);
				newItem = Math.floor(newItem / 3);
				let throwingTo = -1;
				if (newItem % monkey.test === 0) {
					throwingTo = monkey.throwToIfTrue;
				} else {
					throwingTo = monkey.throwToIfFalse;
				}
				data.find((x) => x.monkeyId === throwingTo)?.items.push(newItem);
				return false;
			});
		});
	}

	console.log(inspected);
	const temp = Object.values(inspected).sort((a, b) => b - a);
	result = temp.slice(0, 2).reduce((a, b) => a * b, 1);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~0 ms - answer: 14508081294

const part2 = (input: string) => {
	const start = now();
	let result = 0;

	const data = input.split("\n\n").map((x) => {
		const regex =
			/Monkey (\d+):\s+Starting items: ((?:\d+(?:, |))+)\s+Operation: (.+)\s+Test: divisible by (\d+)\s+If true: throw to monkey (\d+)\s+If false: throw to monkey (\d+)/g.exec(
				x
			);
		const [monkeyId, startingItemsComma, operation, test, throwToIfTrue, throwToIfFalse] = regex?.slice(1) ?? [];
		return {
			monkeyId: Number(monkeyId),
			items: startingItemsComma.split(", ").map(Number),
			operation: operation.replace("new", "newItem"),
			test: Number(test),
			throwToIfTrue: Number(throwToIfTrue),
			throwToIfFalse: Number(throwToIfFalse),
		};
	});

	//  Modulo magic, combine all tests and modulo the value by that each time
	const division = data.reduce((acc, val) => acc * val.test, 1);

	const inspected: { [key: string]: number } = {};

	for (let i = 0; i < 10000; i++) {
		console.log("Round", i);
		data.forEach((monkey) => {
			monkey.items = monkey.items.filter((item) => {
				if (!inspected[monkey.monkeyId]) {
					inspected[monkey.monkeyId] = 0;
				}
				inspected[monkey.monkeyId]++;

				// Only used in eval
				let old = item;
				let newItem = 0;
				eval(monkey.operation);

				// Magic
				newItem = newItem % division;

				let throwingTo = -1;
				if (newItem % monkey.test === 0) {
					throwingTo = monkey.throwToIfTrue;
				} else {
					throwingTo = monkey.throwToIfFalse;
				}
				data.find((x) => x.monkeyId === throwingTo)?.items.push(newItem);
				return false;
			});
		});
	}

	const temp = Object.values(inspected).sort((a, b) => b - a);
	result = temp.slice(0, 2).reduce((a, b) => a * b, 1);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
