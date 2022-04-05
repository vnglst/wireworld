import type { RuleSet } from './rules';
import type { Storage } from './storage';

export class World {
	public cells: string[][];
	public width: number;
	public height: number;
	public ruleSet: RuleSet;
	public storage: Storage;
	public initialState: string;

	constructor(public name: string) {}

	init(): this {
		this.cells = Array(this.width)
			.fill(null)
			.map(() => Array(this.height).fill(this.initialState));

		// (globalThis as any).world = this;

		return this;
	}

	save() {
		this.storage.save(this.cells);
	}

	restore() {
		const restoredCells = this.storage.restore() as string[][] | undefined;
		if (!restoredCells) return;
		this.cells = restoredCells;
	}

	clear() {
		this.cells = Array(this.width)
			.fill(null)
			.map(() => Array(this.height).fill(this.initialState));
	}

	get(x: number, y: number) {
		const { width, height } = this;
		const x2 = x < 0 ? width + x : x;
		const y2 = y < 0 ? height + y : y;
		return this.cells[x2 % width][y2 % height];
	}

	update(x: number, y: number, state: string) {
		this.cells[x][y] = state;
	}

	getNeighbours(x: number, y: number) {
		const matrix = [
			[x - 1, y - 1], // nw
			[x, y - 1], // n
			[x - 1, y + 1], // ne
			[x - 1, y], // w
			[x + 1, y], // e
			[x, y + 1], // s
			[x + 1, y - 1], // sw
			[x + 1, y + 1] // se
		];

		return matrix.map(([x, y]) => this.get(x, y));
	}

	tick() {
		this.cells = this.cells.map((rows, x) =>
			rows.map((state, y) => this.ruleSet.get(state).rule(() => this.getNeighbours(x, y)))
		);
	}
}

export class WorldBuilder extends World {
	constructor(public name: string) {
		super(name);
	}

	setWidth(width: number): this {
		this.width = width;
		return this;
	}

	setHeight(height: number): this {
		this.height = height;
		return this;
	}

	setRuleset(ruleSet: RuleSet): this {
		this.ruleSet = ruleSet;
		return this;
	}

	setStorage(storage: Storage): this {
		this.storage = storage;
		return this;
	}

	setInitialstate(initialState: string): this {
		this.initialState = initialState;
		return this;
	}
}
