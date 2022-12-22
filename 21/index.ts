import { default as now } from "performance-now";
//@ts-ignore
import { Equation, parse } from "algebra.js";

// As if i'm going to solve such a large formula by hand. Just import a library (:
// Delta time was pretty high, because WolframAlpha couldn't solve it due to character limit.

// Part 1
// ======
// ~19 ms - answer: 21208142603224

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	const data = input.split("\n").reduce((acc, line) => {
		const [name, calc] = line.split(": ");
		acc[name] = calc;
		return acc;
	}, {} as { [key: string]: string });

	const numbers = {} as { [key: string]: number };

	Object.entries(data)
		.filter(([_, v]) => !v.includes(" "))
		.forEach((x) => {
			numbers[x[0]] = +x[1];
			delete data[x[0]];
		});

	while (Object.values(data).some((v) => v.includes(" "))) {
		for (const [name, calc] of Object.entries(data)) {
			if (!calc.includes(" ")) {
				continue;
			}

			const [a, op, b] = calc.split(" ");

			if (a in numbers && b in numbers) {
				numbers[name] = eval(`${numbers[a]} ${op} ${numbers[b]}`);
				delete data[name];
			}
		}
	}

	result = numbers["root"];

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~25 ms - answer: 3882224466191

const part2 = (input: string) => {
	const start = now();
	let result = 0;

	const data = input.split("\n").reduce((acc, line) => {
		const [name, calc] = line.split(": ");
		acc[name] = calc;
		return acc;
	}, {} as { [key: string]: string });

	const numbers = {} as { [key: string]: string };

	Object.entries(data)
		.filter(([_, v]) => !v.includes(" "))
		.forEach((x) => {
			numbers[x[0]] = x[1];
			delete data[x[0]];
		});

	numbers["humn"] = "x";
	delete data["humn"];

	while (Object.values(data).some((v) => v.includes(" "))) {
		for (const [name, calc] of Object.entries(data)) {
			if (!calc.includes(" ")) {
				continue;
			}

			let [a, op, b] = calc.split(" ");

			if (a in numbers && b in numbers) {
				if (name === "root") {
					op = "=";
				}
				if (!numbers[a].includes("x") && !numbers[b].includes("x")) {
					numbers[name] = "" + eval(`(${numbers[a]}) ${op} (${numbers[b]})`);
				} else {
					numbers[name] = `(${numbers[a]}) ${op} (${numbers[b]})`;
				}
				delete data[name];
			}
		}
	}
	const equalsIndex = numbers["root"].indexOf("=");
	const formula = numbers["root"];
	const eq = parse(formula.slice(0, equalsIndex));

	const equation = new Equation(eq, eval(formula.slice(equalsIndex + 1)));
	result = eval(equation.solveFor("x").toString());

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
