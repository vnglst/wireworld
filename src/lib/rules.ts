type Rule = {
	color: string;
	textColor: string;
	name: string;
	rule: (fn: () => string[]) => string;
};

export type RuleSet = Map<string, Rule>;

export const conway: RuleSet = new Map();

conway.set('e', {
	color: 'black',
	textColor: '#eee',
	rule: (getNeighbors) => {
		const life = getNeighbors().filter((n) => n === 'l').length;
		if (life === 3) return 'l';
		return 'e';
	},
	name: 'Empty'
});

conway.set('l', {
	color: '#ffd700',
	textColor: '#011627',
	rule: (getNeighbors) => {
		const life = getNeighbors().filter((n) => n === 'l').length;
		if (life === 1) return 'e';
		if (life === 2 || life === 3) return 'l';
		return 'e';
	},
	name: 'Life'
});

export const wireWorld: RuleSet = new Map();

wireWorld.set('e', { color: 'black', textColor: '#eee', rule: () => 'e', name: 'Empty' });

wireWorld.set('h', {
	color: '#0080ff',
	textColor: '#011627',
	rule: () => 't',
	name: 'Head'
});

wireWorld.set('t', {
	color: '#ff4004',
	textColor: '#011627',
	rule: () => 'c',
	name: 'Tail'
});

wireWorld.set('c', {
	color: '#ffd700',
	textColor: '#011627',
	rule: (getNeighbors) => {
		const heads = getNeighbors().filter((n) => n === 'h').length;
		if (heads === 1 || heads === 2) return 'h';
		return 'c';
	},
	name: 'Conductor'
});
