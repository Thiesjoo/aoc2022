import { default as now } from "performance-now";

function mix(data: number[], rounds: number): number[] {
	const nums = data.map((x) => ({ val: x }));
	let originalOrder = [...nums];

	for (let mixCount = 0; mixCount < rounds; mixCount++) {
		originalOrder.forEach((num) => {
			let index = nums.indexOf(num)!;
			nums.splice(index, 1);

			let target = index + num.val;
			if (target < 0) target += nums.length * Math.abs(Math.floor(target / nums.length));
			if (target >= nums.length) target = target % nums.length;

			nums.splice(target, 0, num);
		});
	}
	return nums.map((x) => x.val);
}

const coords = (numbers: number[]): number => {
	const zeroIndex = numbers.indexOf(0);
	const a = numbers[(zeroIndex + 1000) % numbers.length];
	const b = numbers[(zeroIndex + 2000) % numbers.length];
	const c = numbers[(zeroIndex + 3000) % numbers.length];
	return a + b + c;
};

// Part 1
// ======
// ~100 ms - answer: 19559

const part1 = (input: string) => {
	const start = now();

	const data = input.split("\n").map(Number);
	let result = coords(mix(data, 1));

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~370 ms - answer: 912226207972

const part2 = (input: string) => {
	const start = now();

	const data = input.split("\n").map(Number);
	let result = coords(
		mix(
			data.map((x) => x * 811589153),
			10
		)
	);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
