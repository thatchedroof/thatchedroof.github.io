<script lang="ts">
	import { corncob } from './corncob.js';

	import { disylls } from './disylls.js';

	const cob: string[] = corncob.filter((word: string) => word.length > 2);

	const usedDisylls: [string, number][] = [];
	//let usedCorncob: string[] = [];
	//let lastCorncobAdd = 0;

	export function buttonPress(text: string) {
		const acronyms = getAcronyms(text, disylls, cob).sort((x, y) => y[1] - x[1]);
		console.log(acronyms);
		const acroDiv = document.getElementById('acronyms')!;
		acroDiv.innerHTML = ``;
		for (let i = 0; i < acronyms.length; i++) {
			if (acroDiv.offsetHeight > 500) {
				console.log('yay', acroDiv.offsetHeight, acronyms[i][0]);
				(acroDiv.lastElementChild! as HTMLElement).style.visibility = 'hidden';
				break;
			}
			acroDiv.innerHTML += `
            <abbr>${acronyms[i][0] + '&nbsp;'}</abbr>
        `;
		}
	}

	/*
function getUnsortedAcronyms(
    inp: string,
    disylls: [string, number][],
    corncob: string[],
): [string, number][] {

    lastCorncobAdd = 0;

    //https://stackoverflow.com/questions/9960908/permutations-in-javascript
    const permutator = (inputArr: string[]) => {
        let result: string[][] = [];

        const permute = (arr: string[], m: string[] = []) => {
            if (arr.length === 0) {
                result.push(m);
            } else {
                for (let i = 0; i < arr.length; i++) {
                    let curr = arr.slice();
                    let next = curr.splice(i, 1);
                    permute(curr, m.concat(...next));
                }
            }
        };

        permute(inputArr);

        return result;
    };

    let splitInp: string[] = String(inp).split(' ');

    console.log(permutator(splitInp));

    return permutator(splitInp)
        .map((value) => ({ value, sort: Math.random() })) //https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
        .map((sInp) => {
            console.log(sInp);
            return getAcronyms(
                sInp.join(' '), disylls, corncob
            );
        }).flat();
}
*/

	function getAcronyms(
		inp: string,
		disylls: [string, number][],
		corncob: string[]
	): [string, number][] {
		//split input into sylls
		const splitInp: string[][] = String(inp)
			.split(' ')
			.map((x: string) => x.toLowerCase().split(/([aeiouy]+)/));

		//input is now only first syllables
		const input: string[] = splitInp
			.map((x: string[]) => x[0] + x[1] + x[2])
			.map((x: string) => toTitleCase(x));

		//list of acronyms to return
		const out: [string, number][] = [];

		//size of each acronym
		let coord: number[] = [];

		//initialize acro coord
		for (let i = 0; i < input.length; i++) {
			coord.push(0);
		}

		//function to increment coord
		function inc(coord: number[], input: string[]) {
			let i = 0;

			while (input[i].length - 1 === coord[i]) {
				coord[i] = 0;
				i++;
			}

			coord[i] = coord[i] + 1;

			return coord;
		}

		//loop through each possible acronym
		while (true) {
			let acro = '';

			//build acronym according to coord
			for (let i = 0; i < input.length; i++) {
				acro = acro.concat(input[i].slice(0, coord[i] + 1));
			}

			//add acronym and score
			out.push([acro, totalScore(acro, disylls, corncob)]);

			//inc coord until coord at max value
			try {
				coord = inc(coord, input);
			} catch (e) {
				break;
			}
		}

		return out;
	}

	function toTitleCase(inp: string): string {
		return inp.charAt(0).toUpperCase() + inp.slice(1).toLowerCase();
	}

	function toSylls(inp: string): string[] {
		//split into sylls
		const input: string[] = inp.toLowerCase().split(/([aeiouy]+)/);

		//add ^ and $ to beginning and end
		const out: string[] = ['^'.concat(input[0])]
			.concat(input.slice(1, input.length - 1))
			.concat([input[input.length - 1].concat('$')]);

		return out;
	}

	function toDisylls(inp: string): string[] {
		const sylls: string[] = toSylls(inp);

		//list of disylls to return
		const out: string[] = [];

		//iterate through each disyll and append to out
		for (let i = 0; i < sylls.length - 1; i++) {
			out.push(sylls[i] + sylls[i + 1]);
		}

		return out;
	}

	function scoreDisylls(inp: string, disylls: [string, number][]): number {
		const inputDisylls: string[] = toDisylls(inp);

		//let score: number = 1;

		//amount of invalid disylls
		let fails = 1;

		//iterate through disylls
		for (let i = 0; i < inputDisylls.length; i++) {
			//find input disyll in list of used disylls
			const index: number = usedDisylls.findIndex(
				(x: [string, number]) => x[0] === inputDisylls[i]
			);

			//if not in usedDisylls
			if (index === -1) {
				const index: number = disylls.findIndex((x: [string, number]) => x[0] === inputDisylls[i]);
				if (index !== -1) {
					usedDisylls.push(disylls[index]);
					console.log(disylls[index]);
				}
			}

			//add to score
			if (index === -1) {
				fails += 1;

				if (fails >= 3) {
					return 0;
				}
			} else {
				//adjust for length and multiply into score
				//score *= disylls[index][1];
			}
		}

		//root by length
		return 1 / fails; //Math.pow(score, 1/inputDisylls.length)
	}

	function scoreCorncob(inp: string, corncob: string[]): number {
		const input: string = inp.toLowerCase();

		let score = 0;

		//iterate through every word
		for (let i = 0; i < corncob.length; i++) {
			const word = corncob[i];

			//find word in input
			const index: number = input.search(word);

			//if word is in input
			if (index !== -1) {
				score += word.length / input.length;
			}
		}

		/*
    if (lastCorncobAdd <= 25) {

        let addedCorncob = false;

        //iterate through every word
        for (let i = 0; i < corncob.length; i++) {

            let word = corncob[i];

            //find word in input
            let index: number = input.search(word);

            //if word is in input
            if (index !== -1) {
                score += word.length / input.length;

                if (!usedCorncob.includes(word)) {
                    usedCorncob.push(word);
                    lastCorncobAdd = 0;
                    addedCorncob = true;
                    console.log(word);
                }

            }
        }

        if (!addedCorncob) {
            lastCorncobAdd += 1;
        }

    } else {
        for (let i = 0; i < usedCorncob.length; i++) {

            let word = usedCorncob[i];

            //find word in input
            let index: number = input.search(word);

            //if word is in input
            if (index !== -1) {
                score += word.length / input.length;
            }
        }
    }

    */

		return score;
	}

	function totalScore(acro: string, disylls: [string, number][], corncob: string[]): number {
		//console.time('di');
		const di = scoreDisylls(acro, disylls);
		//console.timeEnd('di');
		let co = 0;
		if (di !== 0) {
			//console.time('co');
			co = scoreCorncob(acro, corncob);
			//console.timeEnd('co');
		}
		return Math.pow(di * co, 1 / toSylls(acro).length);
	}

	let text: string;
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="twitter:card" content="summary" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="make acronyms" />
	<meta property="og:description" content="automatic acronym generator" />
	<meta
		property="og:image"
		content="https://cdn.discordapp.com/avatars/471354140639887400/44c9c22ebd692580a5b8476efb361c04.png"
	/>
	<meta property="og:url" content="https://thatchedroof.github.io/auto-acronym/" />
	<title>Super Acronym Generator</title>
	<link rel="stylesheet" href="main.css" />
	<link
		rel="icon"
		type="image/png"
		href="https://cdn.discordapp.com/avatars/471354140639887400/44c9c22ebd692580a5b8476efb361c04.png"
	/>
</svelte:head>

<h1 id="title">The super auto mega acronym creator!!! (insert acronym)</h1>
<ul>
	<li>
		<label for="input">Text to acronymize (space separated)</label><br />
		<input type="text" id="input" name="input" bind:value={text} /><br />
	</li>
	<li class="button">
		<button type="button" on:click={() => buttonPress(text)}> Generate acronyms! </button>
	</li>
</ul>
<div id="acronyms" />
<noscript>ENABLE JAVASCRIPT RIGHT NOW</noscript>

<style>
	:root {
		background-color: rgb(31, 31, 31);
		color: rgb(222, 227, 245);
		font-family: monospace;
	}

	body {
		margin: 0;
	}

	#title {
		margin: 0 auto;
		padding: 1em;
	}

	ul {
		width: 300px;
		margin: 0 auto;
		list-style: none;
		padding: 1em;
	}

	li {
		margin-top: 1em;
	}

	input,
	textarea {
		background-color: rgb(43, 43, 43);
		color: rgb(222, 227, 245);
		font-family: inherit;
		width: 300px;
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
		font-size: inherit;
		background-color: rgb(43, 43, 43);
		color: rgb(222, 227, 245);
		cursor: pointer;
	}

	button:active {
		background-color: rgb(222, 227, 245);
		color: rgb(43, 43, 43);
	}

	#acronyms {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		margin: 30px;
		gap: 15px 7px;
	}

	#acronyms::after {
		content: '';
		flex: auto;
	}

	.abbr {
		font-family: inherit;
		font-weight: bold;
		font-size: 20px;
		color: rgb(241, 243, 250);
	}
</style>
