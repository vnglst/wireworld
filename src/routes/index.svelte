<script>
	import { onMount } from 'svelte';
	import { WorldBuilder } from '../lib/world.model';
	import { conway, wireWorld } from '../lib/rules';
	import Button from '../lib/Button.svelte';
	import { Storage } from '$lib/storage';

	const world = new WorldBuilder('world')
		.setWidth(50)
		.setHeight(30)
		.setRuleset(wireWorld)
		.setInitialstate('e')
		.setStorage(new Storage('world'))
		.init();

	const SQUARE = 20;
	const BASE_SPEED = 200;
	const CANVAS_W = SQUARE * world.width;
	const CANVAS_H = SQUARE * world.height;

	let drawMode = 'e';
	let isDrawing = false;
	let isPlaying = false;
	let speed = 0;
	let ctx;
	let canvas;

	const drawWorld = () => {
		const startX = 0;
		const maxX = world.cells.length;

		const startY = 0;
		const maxY = world.cells[0].length;

		for (let x = startX; x < maxX; x++) {
			for (let y = startY; y < maxY; y++) {
				const state = world.get(x, y);
				ctx.fillStyle = world.ruleSet.get(state).color;
				const border = 1;
				ctx.fillRect(x * SQUARE + border, y * SQUARE + border, SQUARE - border, SQUARE - border);
			}
		}
	};

	const tick = () => {
		world.tick();
		drawWorld();
		if (isPlaying) {
			setTimeout(() => {
				requestAnimationFrame(tick);
			}, BASE_SPEED - (BASE_SPEED * speed) / 100);
		}
	};

	const getMousePos = (e) => {
		const rect = canvas.getBoundingClientRect();
		const scaleX = canvas.width / rect.width / SQUARE;
		const scaleY = canvas.height / rect.height / SQUARE;
		return {
			x: Math.floor((e.clientX - rect.left) * scaleX),
			y: Math.floor((e.clientY - rect.top) * scaleY)
		};
	};

	onMount(() => {
		canvas = document.getElementById('canvas');
		ctx = canvas.getContext('2d');
		ctx.fillStyle = '#323232';
		ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
		world.restore();
		drawWorld();
	});
</script>

<main>
	<canvas
		id="canvas"
		width={CANVAS_W}
		height={CANVAS_H}
		on:mousedown={(e) => {
			isDrawing = true;
			const { x, y } = getMousePos(e);
			// if cell is not clear, clear it when clicking
			const shouldClear = world.get(x, y) !== 'e';
			world.update(x, y, shouldClear ? 'e' : drawMode);
			drawWorld();
		}}
		on:mouseup={() => {
			isDrawing = false;
		}}
		on:mousemove={(e) => {
			if (!isDrawing) return false;
			const { x, y } = getMousePos(e);
			world.update(x, y, drawMode);
			drawWorld();
		}}
	/>

	<div class="buttonGroup">
		<Button
			on:click={() => {
				isPlaying = !isPlaying;
				tick();
			}}>{isPlaying ? 'Pause' : 'Play'}</Button
		>
		{#each [...world.ruleSet] as [id, cell]}
			<Button textColor={cell.textColor} color={cell.color} on:click={() => (drawMode = id)}
				>{drawMode === id ? '• ' : ''}{cell.name}</Button
			>
		{/each}
		<label for="volume">Speed</label>
		<input bind:value={speed} type="range" id="speed" name="speed" min="0" max="100" />
		<div class="bottom">
			<div class="square" style="--color: {world.ruleSet.get(drawMode).color}" />
			<button
				class="link-btn"
				on:click={() => {
					world.create();
					drawWorld();
				}}>Clear</button
			>
			<button class="link-btn" on:click={() => world.save()}>Save</button>
		</div>
	</div>
</main>

<style>
	:global(body) {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu,
			Cantarell, 'Helvetica Neue', sans-serif;
	}
	canvas {
		cursor: pointer;
		border-radius: 0.5rem;
		box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14),
			0px 3px 1px -2px rgba(0, 0, 0, 0.12);
	}

	main {
		display: flex;
	}

	.buttonGroup {
		display: flex;
		flex-direction: column;
		margin-left: 1rem;
	}

	.link-btn {
		border: none;
		box-shadow: none;
		text-align: left;
		padding: 0;
		margin: 15px 0 0 0;
		color: var(--textColor);
		background-color: white;
		font-weight: 900;
		font-size: 1rem;
	}

	.link-btn:hover {
		text-decoration: underline;
	}

	label {
		text-align: center;
		margin: 10px 0;
	}

	.bottom {
		display: flex;
		flex-direction: column;
		margin-top: auto;
	}

	.square {
		height: 50px;
		width: 50px;
		border-radius: 0.5rem;
		background-color: var(--color);
		box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14),
			0px 3px 1px -2px rgba(0, 0, 0, 0.12);
	}
</style>
