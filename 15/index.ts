import { default as now } from "performance-now";

// Part 1
// ======
// ~3240 ms - answer: 5127797

//5698300 too high
const part1 = (input: string) => {
	const start = now();
	let result = 0;

	const data = input.split("\n").map((line) => {
		const regex = /(x=(-?\d+), y=(-?\d+))/g;
		const match1 = regex.exec(line) || [];
		const sensorPos = [match1[2] ? Number(match1[2]) : 0, match1[3] ? Number(match1[3]) : 0];
		const match2 = regex.exec(line) || [];
		const beaconPos = [match2[2] ? Number(match2[2]) : 0, match2[3] ? Number(match2[3]) : 0];
		return {
			pos: sensorPos,
			beacon: beaconPos,
			maxRange: Math.abs(sensorPos[0] - beaconPos[0]) + Math.abs(sensorPos[1] - beaconPos[1]),
		};
	});

	// Return the scan range of x values
	const scanRange = data.reduce(
		([currMin, currMax], currSensor): [number, number] => {
			return [
				Math.min(currMin, currSensor.pos[0] - currSensor.maxRange),
				Math.max(currMax, currSensor.pos[0] + currSensor.maxRange),
			];
		},
		[1000000000, -1000000000]
	);

	// All the xcoord to check:
	const xCoords = Array.from({ length: scanRange[1] - scanRange[0] + 1 }, (_, i) => i + scanRange[0]);

	const yMAX = 2000000;

	// For each x coord, check if the x,y combination is in range of any sensor
	const inRange = xCoords.reduce((acc, x) => {
		const sensor = data.find((sensor) => {
			const [x1, y1] = sensor.pos;
			const [x2, y2] = sensor.beacon;
			// check if it's not a beacon itself
			if (x === x2 && yMAX === y2) return false;

			const maxRange = sensor.maxRange;
			return Math.abs(x - x1) + Math.abs(y1 - yMAX) <= maxRange;
		});

		return acc + (sensor ? 1 : 0);
	}, 0);

	result = inRange;

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~45000 ms(koala lang) - answer: 12518502636475

const part2 = (input: string) => {
	const start = now();
	let result = 0;
	const data = input.split("\n").map((line) => {
		const regex = /(x=(-?\d+), y=(-?\d+))/g;
		const match1 = regex.exec(line) || [];
		const sensorPos = [match1[2] ? Number(match1[2]) : 0, match1[3] ? Number(match1[3]) : 0];
		const match2 = regex.exec(line) || [];
		const beaconPos = [match2[2] ? Number(match2[2]) : 0, match2[3] ? Number(match2[3]) : 0];
		return {
			pos: sensorPos,
			beacon: beaconPos,
			maxRange: Math.abs(sensorPos[0] - beaconPos[0]) + Math.abs(sensorPos[1] - beaconPos[1]),
		};
	});

	const MAXXX = 4000000;

	// Handy dandy tricka
	const perimeter = (from: { pos: number[]; beacon: number[]; maxRange: number }) => {
		const centre = from.pos;
		const topRight = Array.from({ length: from.maxRange + 2 }, (_, i) => [
			centre[0] + i,
			centre[1] - from.maxRange + i - 1,
		]);
		const bottomRight = Array.from({ length: from.maxRange + 2 }, (_, i) => [
			centre[0] + i,
			centre[1] + from.maxRange - i + 1,
		]);
		const bottomLeft = Array.from({ length: from.maxRange + 2 }, (_, i) => [
			centre[0] - i,
			centre[1] + from.maxRange - i + 1,
		]);
		const topLeft = Array.from({ length: from.maxRange + 2 }, (_, i) => [
			centre[0] - i,
			centre[1] - from.maxRange + i - 1,
		]);
		return [...topRight, ...bottomRight, ...bottomLeft, ...topLeft];
	};

	const inRange = (location: number[]) => {
		return !data.find((sensor) => {
			const [x1, y1] = sensor.pos;

			const maxRange = sensor.maxRange;
			return Math.abs(location[0] - x1) + Math.abs(y1 - location[1]) <= maxRange;
		});
	};

	const hoi = data.flatMap((sensor, i) => {
		const pointsToCheck = perimeter(sensor);
		return pointsToCheck
			.map((x) => {
				if (x[0] < 0 || x[0] > MAXXX || x[1] < 0 || x[1] > MAXXX) return undefined;
				if (inRange(x)) return x;
				return undefined;
			})
			.filter((x) => x !== undefined);
	});

	//@ts-ignore
	result = hoi[0][0] * 4000000 + hoi[0][1];

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
