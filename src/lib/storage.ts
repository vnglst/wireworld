import { stringify, parse } from 'zipson';

export class Storage {
	constructor(private key: string) {}

	save(obj: unknown) {
		const compressed = stringify(obj);
		const encoded = encodeURIComponent(compressed);
		const url = new URL(location.origin);
		url.searchParams.set(this.key, encoded);
		history.pushState(null, null, url);
	}

	restore() {
		const url = new URL(location.href);
		const encoded = url.searchParams.get(this.key);
		if (!encoded) return;
		const compressed = decodeURIComponent(encoded);
		const obj = parse(compressed);

		// make sure to clone, since cells share memory after decompress
		return JSON.parse(JSON.stringify(obj));
	}

	clear() {
		const url = new URL(location.origin);
		history.pushState(null, null, url.origin);
	}
}
