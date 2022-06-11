<script lang="ts">
	let mouseDown = 0;

	const flipped: number[] = Array(10).fill(0);
	let tempFlipped: number[] = Array(10).fill(0);
	let r1: number;
	let r2: number;
	let roll: number;

	let die1Number = 1;
	let die2Number = 1;

	let sumButtonContent: string = '';
	let sumButtonAllowed: boolean = false;

	// const root = document.querySelector(':root');
	// const die1 = document.querySelector('#die1');
	// const die2 = document.querySelector('#die2');

	reroll();
	buttonUpdate();

	let start = Date.now();
	let timerInterval: NodeJS.Timer;
	starttimer();

	/**
	 * Rerolls both dice on the page
	 */
	function reroll() {
		r1 = Math.floor(Math.random() * 6) + 1;
		changeDieState(1, r1);

		r2 = Math.floor(Math.random() * 6) + 1;
		changeDieState(2, r2);

		roll = r1 + r2;
	}

	let timer: string;

	/**
	 * Starts the page timer
	 */
	function starttimer() {
		timerInterval = setInterval(function () {
			var delta = Date.now() - start;
			timer = (Math.floor(delta / 100) / 10).toFixed(1);
		}, 10);
	}

	/**
	 * Stops the page timer
	 */
	function stoptimer() {
		clearInterval(timerInterval);
		console.log('timer averted');
	}
	/**
	 * Resets the page timer
	 */
	//function resettimer() {}

	//die1.addEventListener("animationiteration", changeAnimation)
	//die1.addEventListener("click", rolldie1)
	//die2.addEventListener("animationiteration", changeAnimation)
	//die2.addEventListener("click", rolldie2)

	//changeAnimation()

	let flippedList: number[] = new Array(10).fill(0);

	/**
	 * Flips a single element
	 */
	function flip(i: number, md = false) {
		console.log('flip', i, md);
		if ((mouseDown || md) && flippedList[i] !== 2) {
			if (flippedList[i] === 1) {
				tempFlipped[i] = 0;
				buttonUpdate();
			} else {
				tempFlipped[i] = i + 1;
				buttonUpdate();
			}
			flippedList[i] = flippedList[i] === 1 ? 0 : 1;
		}
	}

	function buttonUpdate() {
		console.log(tempFlipped);
		sumButtonContent = String(tempFlipped.reduce((a, b) => a + b, 0)) + ' / ' + String(roll);
		if (tempFlipped.reduce((a, b) => a + b, 0) === roll) {
			sumButtonAllowed = true;
		} else {
			sumButtonAllowed = false;
		}
	}

	function flippedUpdate() {
		for (let i = 0; i < flipped.length; i++) {
			if (flipped[i] !== 0) {
				flippedList[i] = 2;
			}
		}
	}

	// function rolldie1() {
	// 	die1.removeEventListener('animationiteration', changeAnimation);
	// 	die1.removeEventListener('click', rolldie1);
	// 	die1.style.animation = 'linear .001';
	// 	die1.style.transform = 'translate(0, 0);';
	// 	r1 = Math.floor(Math.random() * 6) + 1;
	// 	changeDieState(die1, r1);
	// 	if (typeof r2 !== 'undefined') {
	// 		roll = r1 + r2;
	// 		buttonUpdate();
	// 	}
	// }

	// function rolldie2() {
	// 	die2.removeEventListener('animationiteration', changeAnimation);
	// 	die2.removeEventListener('click', rolldie2);
	// 	die2.style.animation = 'linear .001';
	// 	die2.style.transform = 'translate(0, 0);';
	// 	r2 = Math.floor(Math.random() * 6) + 1;
	// 	changeDieState(die2, r2);
	// 	if (typeof r1 !== 'undefined') {
	// 		roll = r1 + r2;
	// 		buttonUpdate();
	// 	}
	// }

	function sumButtonClick() {
		for (let i = 0; i < flipped.length; i++) {
			if (flipped[i] === 0) {
				flipped[i] = tempFlipped[i];
			}
		}
		flippedUpdate();
		tempFlipped = Array(10).fill(0);
		if (flipped.every((e) => e)) {
			stoptimer();
			sumButtonContent = 'You Win!';
		} else {
			reroll();
			buttonUpdate();
		}
	}

	// function changeAnimation() {
	// 	changeDieState(die1, Math.floor(Math.random() * 6) + 1);
	// 	changeDieState(die2, Math.floor(Math.random() * 6) + 1);
	// 	const shakeStrength = 10;
	// 	let die1pixelsx = (Math.random() - 0.5) * shakeStrength;
	// 	let die1pixelsy = (Math.random() - 0.5) * shakeStrength;
	// 	let die2pixelsx = (Math.random() - 0.5) * shakeStrength;
	// 	let die2pixelsy = (Math.random() - 0.5) * shakeStrength;

	// 	document.getElementById('keyframe-style').innerHTML =
	// 		'@keyframes shake-die1 {100% {transform: translate(' +
	// 		Math.round(die1pixelsx * 100) / 100 +
	// 		'px, ' +
	// 		Math.round(die1pixelsy * 100) / 100 +
	// 		'px);}}\n@keyframes shake-die2 {100% {transform: translate(' +
	// 		Math.round(die2pixelsx * 100) / 100 +
	// 		'px, ' +
	// 		Math.round(die2pixelsy * 100) / 100 +
	// 		'px);}}';

	// 	console.log(die1pixelsx, die1pixelsy, die2pixelsx, die2pixelsy);
	// }

	function changeDieState(die: number, state: number) {
		if (die === 1) {
			die1Number = state;
		} else {
			die2Number = state;
		}
	}

	function checkState1(inp: number[]) {
		return inp.includes(die1Number) ? '#1F1F1F' : '#FFF1DC';
	}

	function checkState2(inp: number[]) {
		return inp.includes(die2Number) ? '#1F1F1F' : '#FFF1DC';
	}
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="twitter:card" content="summary" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="FLIPING DICE GAME" />
	<meta property="og:description" content="beta mode (funtesting :)" />
	<meta property="og:image" content="https://thatchedroof.github.io/partition-game/diecon.png" />
	<meta property="og:url" content="https://thatchedroof.github.io/partition-game/" />
	<title>thathc roof world FLIPING DICE GAME</title>
	<link rel="stylesheet" href="main.css" />
	<style id="keyframe-style">
		@keyframes shake {
			100% {
				transform: translate(100px, 100px);
			}
		}
	</style>
	<link
		rel="icon"
		type="image/png"
		href="https://cdn.discordapp.com/avatars/471354140639887400/44c9c22ebd692580a5b8476efb361c04.png"
	/>
</svelte:head>

<svelte:body
	on:mousedown={() => {
		mouseDown = 1;
	}}
	on:mouseup={() => {
		mouseDown = 0;
	}} />

<div id="flip-cards">
	<svg
		id="die1"
		class="die"
		width="84"
		height="84"
		viewBox="0 0 84 84"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect width="84" height="84" fill="#1F1F1F" />
		<g id="die-body">
			<rect id="die-highlight" width="84" height="84" rx="18" fill="#FFFAF4" />
			<g id="shadow-mask">
				<mask
					id="mask0"
					mask-type="alpha"
					maskUnits="userSpaceOnUse"
					x="0"
					y="0"
					width="84"
					height="84"
				>
					<path id="die-shadow-mask" d="M84 0V84H0L84 0Z" fill="#C4C4C4" />
				</mask>
				<g mask="url(#mask0)">
					<rect id="die-shadow" width="84" height="84" rx="18" fill="#E3D7C5" />
				</g>
			</g>
			<rect id="front-face" x="4" y="4" width="76" height="76" rx="17" fill="#FFF1DC" />
		</g>
		<g id="die-pips">
			<circle
				id="pip-7"
				class="pip four five six"
				cx="62"
				cy="22"
				r="6"
				fill={checkState1([4, 5, 6])}
			/>
			<circle
				id="pip-6"
				class="pip two three four five six"
				cx="62"
				cy="62"
				r="6"
				fill={checkState1([2, 3, 4, 5, 6])}
			/>
			<circle id="pip-5" class="pip six" cx="62" cy="42" r="6" fill={checkState1([6])} />
			<circle
				id="pip-4"
				class="pip two three four five six"
				cx="22"
				cy="22"
				r="6"
				fill={checkState1([2, 3, 4, 5, 6])}
			/>
			<circle
				id="pip-3"
				class="pip four five six"
				cx="22"
				cy="62"
				r="6"
				fill={checkState1([4, 5, 6])}
			/>
			<circle id="pip-2" class="pip six" cx="22" cy="42" r="6" fill={checkState1([6])} />
			<circle
				id="pip-1"
				class="pip one three five"
				cx="42"
				cy="42"
				r="6"
				fill={checkState1([1, 3, 5])}
			/>
		</g>
	</svg>
	<svg
		id="die2"
		class="die"
		width="84"
		height="84"
		viewBox="0 0 84 84"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect width="84" height="84" fill="#1F1F1F" />
		<g id="die-body">
			<rect id="die-highlight" width="84" height="84" rx="18" fill="#FFFAF4" />
			<g id="shadow-mask">
				<mask
					id="mask0"
					mask-type="alpha"
					maskUnits="userSpaceOnUse"
					x="0"
					y="0"
					width="84"
					height="84"
				>
					<path id="die-shadow-mask" d="M84 0V84H0L84 0Z" fill="#C4C4C4" />
				</mask>
				<g mask="url(#mask0)">
					<rect id="die-shadow" width="84" height="84" rx="18" fill="#E3D7C5" />
				</g>
			</g>
			<rect id="front-face" x="4" y="4" width="76" height="76" rx="17" fill="#FFF1DC" />
		</g>
		<g id="die-pips">
			<circle
				id="pip-7"
				class="pip four five six"
				cx="62"
				cy="22"
				r="6"
				fill={checkState2([4, 5, 6])}
			/>
			<circle
				id="pip-6"
				class="pip two three four five six"
				cx="62"
				cy="62"
				r="6"
				fill={checkState2([2, 3, 4, 5, 6])}
			/>
			<circle id="pip-5" class="pip six" cx="62" cy="42" r="6" fill={checkState2([6])} />
			<circle
				id="pip-4"
				class="pip two three four five six"
				cx="22"
				cy="22"
				r="6"
				fill={checkState2([2, 3, 4, 5, 6])}
			/>
			<circle
				id="pip-3"
				class="pip four five six"
				cx="22"
				cy="62"
				r="6"
				fill={checkState2([4, 5, 6])}
			/>
			<circle id="pip-2" class="pip six" cx="22" cy="42" r="6" fill={checkState2([6])} />
			<circle
				id="pip-1"
				class="pip one three five"
				cx="42"
				cy="42"
				r="6"
				fill={checkState2([1, 3, 5])}
			/>
		</g>
	</svg>
	{#each Array(10) as _, i}
		<div
			id="f{i}"
			class:flip-down={flippedList[i] === 0}
			class:flip-up={flippedList[i] === 1}
			class:flip-real-up={flippedList[i] === 2}
			on:mouseenter={() => flip(i)}
			on:mousedown={() => flip(i, true)}
		>
			{i + 1}
		</div>
	{/each}
	<div
		id="sum-button"
		class:sum-button-not-allowed={!sumButtonAllowed}
		class:sum-button-allowed={sumButtonAllowed}
		on:click={() => {
			if (sumButtonAllowed) {
				sumButtonClick();
			}
		}}
	>
		{sumButtonContent}
	</div>
	<div id="timer">{timer}</div>
</div>
<noscript>ENABLE JAVASCRIPT RIGHT NOW</noscript>

<style>
	:root {
		background-color: rgb(31, 31, 31);
		color: rgb(31, 31, 31);
		margin: 0;
	}

	#flip-cards {
		display: grid;
		background-color: rgb(31, 31, 31);
		grid-template-columns: auto 110px 10px 10px 110px auto;
		grid-template-rows: auto repeat(10, 30px) auto 30px;
		row-gap: 3px;
		width: 100vw;
		height: 100vh;
	}

	.flip-up {
		grid-column: 3 / 6;
		background-color: navajowhite;
		padding-left: 50px;
	}

	.flip-down {
		grid-column: 2 / 5;
		background-color: navajowhite;
		padding-right: 50px;
	}

	.flip-real-up {
		grid-column: 3 / 6;
		background-color: rgb(177, 147, 109);
	}

	.flip-up,
	.flip-down,
	.flip-real-up {
		font-family: monospace;
		font-size: 20px;
		text-align: center;
		padding-top: 4px;
		padding-bottom: 4px;
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	#die1,
	#die2 {
		margin: auto;
		animation-direction: alternate-reverse;
	}

	#die1 {
		grid-column: 2 / 3;
		animation: shake-die1 0.001s infinite;
	}

	#die2 {
		grid-column: 5 / 6;
		animation: shake-die2 0.001s infinite;
	}

	.sum-button-allowed,
	.sum-button-not-allowed {
		font-family: sans-serif;
		text-align: center;
		font-style: italic;
		font-weight: bold;
		font-size: 50px;
		margin: auto;
		grid-row: 12 / 13;
		grid-column: 1 / 7;
		border-style: outset;
		border-width: medium;
		border-color: rgb(43, 43, 43);
		border-radius: 0.3em;
		padding: 0.15em 0.35em 0.25em 0.25em;
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	.sum-button-allowed {
		color: greenyellow;
		text-shadow: 2px 2px 2px greenyellow;
		cursor: pointer;
	}

	.sum-button-not-allowed {
		color: crimson;
		text-shadow: 2px 2px 2px crimson;
		cursor: not-allowed;
	}

	.sum-button-allowed:active {
		border-style: inset;
		padding: 0.17em 0.35em 0.23em 0.25em;
	}

	#timer {
		font-family: sans-serif;
		text-align: center;
		font-weight: bold;
		color: white;
		margin: auto;
		font-size: 25px;
		grid-row: 13 / 14;
		grid-column: 1 / 7;
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
</style>
