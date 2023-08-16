<script lang="ts">
    let splitInp: string[] = [];
    function returnHue(i: number): string {
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
        return `hsl(${hue}, 30%, 30%)`;
    }

    let outputSize: number = 2000;

    function buttonPress(): void {
        let inp = <HTMLInputElement>document.getElementById('input');

        let input = inp.value;

        let options = {
            break: (<HTMLInputElement>(
                document.querySelector('input[name="break"]:checked')
            )).value,
        };

        splitInp = splitText(input, outputSize, options);

        console.log(splitInp);

        // for (let i = 0; i < splitInp.length; i++) {
        //     let outputItem = document.createElement('div');

        //     outputItem.classList.add('output-item');

        //     //

        //     let outputText = document.createElement('textarea');

        //     //outputText.setAttribute('readonly', 'readonly');

        //     outputText.setAttribute('rows', '10');

        //     outputText.setAttribute('id', `output-text-${i}`);

        //     outputText.value = splitInp[i];

        //     outputText.classList.add('output-text');

        //     //

        //     let outputClip = document.createElement('button');

        //     outputClip.setAttribute('onclick', `selectOutput(${i})`);

        //     outputClip.classList.add('copy-button');

        //     outputClip.innerText = 'Copy';

        //     let hue: number = 0;

        //     if (splitInp.length === 2) {
        //         if (i === 0) {
        //             hue = 0;
        //         } else {
        //             hue = 240;
        //         }
        //     } else if (splitInp.length === 3) {
        //         if (i === 0) {
        //             hue = 0;
        //         } else if (i === 1) {
        //             hue = 120;
        //         } else {
        //             hue = 240;
        //         }
        //     } else if (splitInp.length === 4) {
        //         if (i === 0) {
        //             hue = 0;
        //         } else if (i === 1) {
        //             hue = 49;
        //         } else if (i === 2) {
        //             hue = 120;
        //         } else {
        //             hue = 240;
        //         }
        //     } else {
        //         hue = i * (256 / (splitInp.length - 1));
        //     }

        //     let color = `hsl(${hue}, 30%, 30%)`;

        //     outputClip.style.backgroundColor = color;

        //     outputClip.style.borderColor = color;

        //     //

        //     outputItem.appendChild(outputClip);

        //     outputItem.appendChild(outputText);

        //     output.appendChild(outputItem);
        // }
    }

    function selectOutput(i: number) {
        let outputText = <HTMLInputElement>(
            document.getElementById(`output-text-${i}`)
        );

        outputText.select();
        outputText.setSelectionRange(0, 99999);

        document.execCommand('copy');
    }

    function splitText(
        input: string,
        maxLength: number,
        options: { break: string },
    ): string[] {
        console.log(options.break);

        if (options.break === 'bc') {
            let out = <string[]>(
                input.match(new RegExp(`(.|[\r\n]){1,${maxLength}}`, 'g'))
            );
            return out;
        }

        let out: string[] = [''];

        let strings: string[] = [];

        if (options.break === 'bw') {
            strings = <string[]>input.match(/[^\s]+\s?|\s/g);
        } else {
            strings = <string[]>input.match(/[^(\r|\n)]+(\r|\n)?|(\r|\n)/g);
        }

        console.log('strings:', strings);

        for (let str of strings) {
            console.log(out[out.length - 1], str);

            if ((out[out.length - 1] + str).length <= maxLength) {
                out[out.length - 1] += str;
            } else if (str.length <= maxLength) {
                out[out.length - 1] = out[out.length - 1];
                out.push(str);
            } else {
                let outLast = out.pop()!;

                let newOptions = options;

                if (options.break === 'bw') {
                    newOptions = Object.assign({}, options, { break: 'bc' });
                } else {
                    newOptions = Object.assign({}, options, { break: 'bw' });
                }

                out = out.concat(
                    splitText(outLast.concat(str), maxLength, newOptions),
                );
            }

            console.log('out:', out);
        }

        return out;
    }
</script>

<svelte:head>
    <meta charset="utf-8" />
    <meta name="twitter:card" content="summary" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Split messages into 2000 characters" />
    <meta property="og:description" content="Or any other message size..." />
    <meta
        property="og:url"
        content="https://thatchedroof.github.io/split-message-2000-chars/"
    />
    <title>Split messages into 2000 characters</title>
</svelte:head>
<div class="header">
    <h1 class="title">Split text into&nbsp;</h1>
    <input type="text" bind:value={outputSize} name="number" id="title-text" />
    <h1 class="title">&nbsp;characters</h1>
</div>
<ul>
    <li>
        <label for="input">Text to split up</label><br />
        <textarea id="input" name="input" rows="15" cols="100" />
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
                checked
            />

            <label for="bw" class="option-label bw">Don't break words</label>
            <input
                type="radio"
                id="bw"
                name="break"
                value="bw"
                class="option-button bw"
            />

            <label for="bl" class="option-label bl">Don't break lines</label>
            <input
                type="radio"
                id="bl"
                name="break"
                value="bl"
                class="option-button bl"
            />
        </div>
    </li>
    <li class="button">
        <button type="button" on:click={buttonPress}>Split text</button>
    </li>
</ul>
<div id="output">
    {#each splitInp as item, i}
        <div class="output-item">
            <button
                class="output-clip copy-button"
                on:click={() => selectOutput(i)}
                id={`output-clip-${i}`}
                style={'background-color: ' +
                    returnHue(i) +
                    '; border-color: ' +
                    returnHue(i) +
                    ';'}
                >Copy
            </button>
            <textarea
                class="output-text"
                readonly
                id={`output-text-${i}`}
                rows="10">{item}</textarea
            >
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

    :global(body) {
        margin: 0;
    }

    .title {
        margin: 0;
        padding: 1em;
        padding-bottom: 0.5em;
        padding-right: 0em;
        padding-left: 0em;
    }
    .header {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-content: center;
        padding-left: 1em;
    }

    #title-text {
        vertical-align: middle;
        display: inline;
        white-space: nowrap;
        width: 2.25em;
        resize: horizontal;
        height: 1.145834375em;
        padding: 0;
        margin-top: 1em;
        margin-bottom: 0.5em;
        margin-left: 0em;
        margin-right: 0em;
        font-family: inherit;
        font-size: 2em;
        border: none;
        font-weight: bold;
        background-color: rgb(31, 31, 31);
        border-color: rgb(45, 45, 45);
        color: rgb(222, 227, 245);
        text-decoration: underline dotted rgb(62, 62, 62);
    }

    ul {
        width: 90%;
        list-style: none;
    }

    li {
        margin-top: 1em;
    }

    input[type='radio'],
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

    input[type='radio']:focus,
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
