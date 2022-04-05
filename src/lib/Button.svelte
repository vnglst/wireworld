<script>
	export let textColor = 'black';
	export let color = 'white';
	export let secColor = 'rgb(255 255 255 / 10%)';
</script>

<button style="--textColor: {textColor}; --color: {color}; --secColor: {secColor};" on:click>
	<slot />
</button>

<style>
	button {
		margin-bottom: 1rem;
		font-weight: 900;
		font-size: 1rem;
		padding: 1rem;
		border-radius: 0.5rem;
		text-shadow: 0 2px 0 rgba(0, 0, 0, 0.07);
		border: none;
		color: var(--textColor);
		box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14),
			0px 3px 1px -2px rgba(0, 0, 0, 0.12);
		text-decoration: none;
		background: linear-gradient(to right, var(--secColor), var(--color) 50%, var(--color) 50%);
		background-size: 200% 100%;
		background-position: 100%;
		transition: background-position 300ms;
	}

	button:hover {
		background-position: 0 100%;
	}

	button:focus {
		outline: none;
	}
</style>
