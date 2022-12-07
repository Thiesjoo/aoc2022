import { default as now } from "performance-now";

export type Node = { name: string } & ({ type: "file"; size: number } | { type: "dir"; children: Node[] });

function getCurrentNode(dir: string, current: Node) {
	if (dir === "/") {
		return current;
	}
	const [_, ...splitted] = dir.split("/");
	console.log(splitted);
	for (let i = 0; i < splitted.length; i++) {
		if (splitted[i] === "") {
			continue;
		}
		if (current.type === "file") {
			throw new Error("This is a file not a dir");
			return current;
		}
		if (current.children.find((c) => c.name === splitted[i])) {
			current = current.children.find((c) => c.name === splitted[i])!;
		} else {
			throw new Error("This is a node that does not exist");
			// return current;
		}
	}
	return current;
}

function determineSize(node: Node): number {
	if (node.type === "file") {
		return node.size;
	} else {
		return node.children.reduce((acc, c) => acc + determineSize(c), 0);
	}
}

// Part 1
// ======
// ~0 ms - answer: 0

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	const data = input.split("\n");

	let current = "/";
	let map: Node = { name: "/", type: "dir", children: [] };
	let allDirs: Node[] = [map];

	for (let i = 0; i < data.length; i++) {
		if (data[i].startsWith("$")) {
			const cmd = data[i].slice(2);
			if (cmd === "ls") {
				const currentNode = getCurrentNode(current, map);
				console.log(current, currentNode, map);

				if (!currentNode || currentNode.type === "file") {
					throw new Error("MAIN - This is a node that does not exist");
				}
				// Loop over data until we encounter a "$"
				let j = i + 1;
				while (j < data.length && !data[j].startsWith("$")) {
					const item = data[j];
					const [sizeOrType, name] = item.split(" ");
					if (!currentNode.children.find((c) => c.name === name)) {
						if (sizeOrType === "dir") {
							const obj = { name, type: "dir", children: [] } as Node;
							currentNode.children.push(obj);
							allDirs.push(obj);
						} else {
							currentNode.children.push({ name, type: "file", size: parseInt(sizeOrType) });
						}
					} else {
						throw new Error("MAIN - Node with name already exists");
					}
					j++;
				}
			} else {
				const [_, dir] = cmd.split(" ");
				if (dir == "/") {
					current = "/";
				} else if (dir === "..") {
					const lastSlash = current.lastIndexOf("/");
					current = current.slice(0, lastSlash);
					if (current == "") {
						current = "/";
					}
				} else {
					current += (current.endsWith("/") ? "" : "/") + dir;
				}
			}
		}
	}

	console.log(map, JSON.stringify(map));
	console.log(allDirs);
	const sizes = allDirs.map((x) => {
		return { name: x.name, size: determineSize(x) };
	});
	console.log(sizes);
	result = sizes.filter((x) => x.size < 100000).reduce((acc, x) => acc + x.size, 0);
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

	const TOTAL = 70000000;

	let current = "/";
	let map: Node = { name: "/", type: "dir", children: [] };
	let allDirs: Node[] = [map];

	for (let i = 0; i < data.length; i++) {
		if (data[i].startsWith("$")) {
			const cmd = data[i].slice(2);
			if (cmd === "ls") {
				const currentNode = getCurrentNode(current, map);
				console.log(current, currentNode, map);

				if (!currentNode || currentNode.type === "file") {
					throw new Error("MAIN - This is a node that does not exist");
				}
				// Loop over data until we encounter a "$"
				let j = i + 1;
				while (j < data.length && !data[j].startsWith("$")) {
					const item = data[j];
					const [sizeOrType, name] = item.split(" ");
					if (!currentNode.children.find((c) => c.name === name)) {
						if (sizeOrType === "dir") {
							const obj = { name, type: "dir", children: [] } as Node;
							currentNode.children.push(obj);
							allDirs.push(obj);
						} else {
							currentNode.children.push({ name, type: "file", size: parseInt(sizeOrType) });
						}
					} else {
						throw new Error("MAIN - Node with name already exists");
					}
					j++;
				}
			} else {
				const [_, dir] = cmd.split(" ");
				if (dir == "/") {
					current = "/";
				} else if (dir === "..") {
					const lastSlash = current.lastIndexOf("/");
					current = current.slice(0, lastSlash);
					if (current == "") {
						current = "/";
					}
				} else {
					current += (current.endsWith("/") ? "" : "/") + dir;
				}
			}
		}
	}

	console.log(map, JSON.stringify(map));
	console.log(allDirs);
	const sizes = allDirs.map((x) => {
		return { name: x.name, size: determineSize(x) };
	});
	console.log(sizes);
	const unused = TOTAL - determineSize(map);
	const neededSpace = 30000000 - unused;
	console.log("needed: ", neededSpace);

	console.log(sizes.filter((x) => x.size > neededSpace).sort((a, b) => a.size - b.size)[0]);
	result = sizes.filter((x) => x.size > neededSpace).sort((a, b) => a.size - b.size)[0].size;
	console.log(unused);
	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
