export class Storage {
	constructor(private key: string) {}

	save(obj: unknown) {
		localStorage.setItem(this.key, JSON.stringify(obj));
	}

	restore() {
		return JSON.parse(localStorage.getItem(this.key)) as unknown;
	}

	clear() {
		localStorage.removeItem(this.key);
	}
}
