<script lang="ts">
	let splitInp: string[] = [];

	$: splitInp = splitText(input, 2000, checked);
	$: console.log(splitInp);

	let input = '';

	let bc = true;

	let bw = false;

	let bl = false;

	let output: HTMLElement;

	let checked: string = 'bc';

	$: checked = bc ? 'bc' : bw ? 'bw' : bl ? 'bl' : 'error';

	/*
	function buttonPress(): void {



		console.log(splitInp);

		for (let i = 0; i < splitInp.length; i++) {
			let outputItem = document.createElement('div');

			outputItem.classList.add('output-item');

			//

			let outputText = document.createElement('textarea');

			//outputText.setAttribute('readonly', 'readonly');

			outputText.setAttribute('rows', '10');

			outputText.setAttribute('id', `output-text-${i}`);

			outputText.value = splitInp[i];

			outputText.classList.add('output-text');

			//

			let outputClip = document.createElement('button');

			outputClip.setAttribute('onclick', `selectOutput(${i})`);

			outputClip.classList.add('copy-button');

			outputClip.innerText = 'Copy';

			let hue: number = 0;

			if (splitInp.length === 2) {
				if (i === 0) {
					hue = 0;
				} else {
					hue = 240;
				}
			} else if (splitInp.length === 3) {
				if (i === 0) {
					hue = 0;
				} else if (i === 1) {
					hue = 120;
				} else {
					hue = 240;
				}
			} else if (splitInp.length === 4) {
				if (i === 0) {
					hue = 0;
				} else if (i === 1) {
					hue = 49;
				} else if (i === 2) {
					hue = 120;
				} else {
					hue = 240;
				}
			} else {
				hue = i * (256 / (splitInp.length - 1));
			}

			let color = `hsl(${hue}, 30%, 30%)`;

			outputClip.style.backgroundColor = color;

			outputClip.style.borderColor = color;

			//

			outputItem.appendChild(outputClip);

			outputItem.appendChild(outputText);

			output.appendChild(outputItem);
		}
	}
    */

	function hue(i: number): number {
		if (splitInp.length === 1) {
			return 0;
		}
		if (splitInp.length === 2) {
			if (i === 0) {
				return 0;
			} else {
				return 240;
			}
		} else if (splitInp.length === 3) {
			if (i === 0) {
				return 0;
			} else if (i === 1) {
				return 120;
			} else {
				return 240;
			}
		} else if (splitInp.length === 4) {
			if (i === 0) {
				return 0;
			} else if (i === 1) {
				return 49;
			} else if (i === 2) {
				return 120;
			} else {
				return 240;
			}
		} else {
			return i * (256 / (splitInp.length - 1));
		}
	}

	function selectOutput(i: number) {
		let ele = output.children.item(i)!.children.item(1)! as HTMLInputElement;

		ele.select();
		ele.setSelectionRange(0, 99999);

		document.execCommand('copy');
	}

	function splitText(input: string, maxLength: number, checked: string): string[] {
		if (input.length === 0) {
			return [];
		}

		if (checked === 'bc') {
			let out = <string[]>input.match(new RegExp(`(.|[\r\n]){1,${maxLength}}`, 'g'));
			return out;
		}

		let out: string[] = [''];

		let strings: string[] = [];

		if (checked === 'bw') {
			strings = <string[]>input.match(/[^\s]+\s?|\s/g);
		} else {
			strings = <string[]>input.match(/[^(\r|\n)]+(\r|\n)?|(\r|\n)/g);
		}

		for (let str of strings) {
			if ((out[out.length - 1] + str).length <= maxLength) {
				out[out.length - 1] += str;
			} else if (str.length <= maxLength) {
				out[out.length - 1] = out[out.length - 1];
				out.push(str);
			} else {
				let outLast = out.pop()!;

				let newOptions = checked;

				if (checked === 'bw') {
					newOptions = 'bc';
				} else {
					newOptions = 'bw';
				}

				out = out.concat(splitText(outLast.concat(str), maxLength, newOptions));
			}
		}
		return out;
	}

	let colors: string[] = [];

	$: colors = splitInp.map(
		(result, i) => `background-color:hsl(${hue(i)}, 30%, 30%);border-color:hsl(${hue(i)}, 30%, 30%)`
	);
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="twitter:card" content="summary" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Split messages into 2000 characters" />
	<meta property="og:description" content="Or any other message size..." />
	<meta
		property="og:image"
		content="https://cdn.discordapp.com/avatars/471354140639887400/44c9c22ebd692580a5b8476efb361c04.png"
	/>
	<meta property="og:url" content="https://thatchedroof.github.io/split-message-2000-chars/" />
	<title>Split messages into 2000 characters</title>
	<link
		rel="icon"
		type="image/png"
		href="https://cdn.discordapp.com/avatars/471354140639887400/44c9c22ebd692580a5b8476efb361c04.png"
	/>
</svelte:head>

<h1 id="title">Split text into 2000 characters</h1>
<ul>
	<li>
		<label for="input">Text to split up</label><br />
		<textarea id="input" name="input" bind:value={input} rows="15" cols="100" />
	</li>
	<li>
		<div id="option-buttons">
			<label for="bc" class="option-label bc">Break everything</label>
			<input
				type="radio"
				id="bc"
				name="break"
				value="bc"
				class="option-button bc"
				bind:group={bc}
				checked
			/>

			<label for="bw" class="option-label bw">Don't break words</label>
			<input
				type="radio"
				id="bw"
				name="break"
				value="bw"
				class="option-button bw"
				bind:group={bw}
			/>

			<label for="bl" class="option-label bl">Don't break lines</label>
			<input
				type="radio"
				id="bl"
				name="break"
				value="bl"
				class="option-button bl"
				bind:group={bl}
			/>
		</div>
	</li>
	<!-- <li class="button">
		<button type="button">Split text</button>
	</li> -->
</ul>
<div id="output" bind:this={output}>
	{#each splitInp as result, i}
		<div class="output-item">
			<button
				class="copy-button"
				style={splitInp.length !== 1 ? colors[i] : ''}
				on:click={() => selectOutput(i)}>Copy</button
			>
			<textarea class="output-text" rows="10" value={result} />
		</div>
	{/each}
</div>
<noscript>ENABLE JAVASCRIPT RIGHT NOW</noscript>

<style>
	:root {
		background-color: rgb(31, 31, 31);
		color: rgb(222, 227, 245);
		font-family: Helvetica, sans-serif;
	}

	body {
		margin: 0;
	}

	#title {
		margin: 0 auto;
		padding: 1em;
		padding-bottom: 0.5em;
	}

	ul {
		width: 90%;
		list-style: none;
	}

	li {
		margin-top: 1em;
	}

	input,
	textarea {
		background-color: rgb(43, 43, 43);
		color: rgb(222, 227, 245);
		font-family: inherit;
		font-size: inherit;
		width: 90%;
		box-sizing: border-box;
		border: 2px inset rgb(41, 41, 41);
		padding: 0.25em;
		padding-left: 0.5em;
		margin-top: 0.25em;
	}

	input:focus,
	textarea:focus {
		outline: none;
		border-color: rgb(54, 54, 54);
		border-style: solid;
		border-radius: 2px;
	}

	button {
		font-family: inherit;
		font-size: 150%;
		font-style: italic;
		font-weight: bold;
		background-color: rgb(43, 43, 43);
		color: rgb(222, 227, 245);
		border-color: rgb(43, 43, 43);
		padding: 0.25em;
		cursor: pointer;
	}

	button:active {
		background-color: rgb(68, 68, 68);
	}

	.output-item {
		display: grid;
		grid-template-columns: 7em auto;
		margin-top: 10px;
		margin-bottom: 10px;
	}

	.output-text {
		padding: 10px;
		grid-column: 2 / 3;
	}

	.copy-button {
		margin: 10px;
		grid-column: 1 / 2;
		margin: auto;
	}

	#input {
		grid-column: 1 / 2;
	}

	#option-buttons {
		width: 15em;
		display: grid;
		grid-template-rows: auto auto auto;
		grid-template-columns: 75% auto;
		background-color: rgb(43, 43, 43);
		border: 2px outset rgb(41, 41, 41);
		border-radius: 1em;
		-webkit-border-radius: 1em;
		-moz-border-radius: 1em;
		-ms-border-radius: 1em;
		-o-border-radius: 1em;
	}

	.bc {
		grid-row: 1 / 2;
	}

	.bw {
		grid-row: 2 / 3;
	}

	.bl {
		grid-row: 3 / 4;
	}

	.option-label {
		padding: 1em;
		cursor: pointer;
	}

	.option-button {
		margin: auto;
		cursor: pointer;
	}
</style>
