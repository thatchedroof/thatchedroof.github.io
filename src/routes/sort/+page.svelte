<script lang="ts">
    import Sortable from './Sortable.js';

    const params = new URLSearchParams(window.location.search);

    let items = document.getElementById('items')!;

    let inp = <HTMLInputElement>document.getElementById('input');

    inp.value = (params.get('items') ?? '')
        .replaceAll(/(?<!\\),/g, '\n')
        .replaceAll(/\\,/g, ',')
        .replaceAll(/(?<!\\)_/g, ' ')
        .replaceAll(/\\_/g, '_');
    console.log(inp.value);
    let input = inp.value.split('\n');

    function buttonPress(): void {
        if ('URLSearchParams' in window) {
            var searchParams = new URLSearchParams(window.location.search);
            searchParams.set(
                'items',
                inp.value
                    .replaceAll(/,/g, '\\,')
                    .replaceAll(/_/g, '\\_')
                    .replaceAll(/\n/g, ',')
                    .replaceAll(/ /g, '_'),
            );
            window.history.pushState(null, '', '?' + searchParams.toString());
        }

        var el = document.getElementById('items');
        var sortable = Sortable.create(el);

        for (let item of input) {
            let li = document.createElement('li');
            li.innerHTML = item;
            li.classList.add('output-item');
            li.classList.add('item');
            items.appendChild(li);
        }
    }

    console.log(params);
</script>

<svelte:head>
    <meta charset="utf-8" />
    <meta name="twitter:card" content="summary" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="what is this" />
    <meta property="og:description" content="where am i" />
    <meta property="og:image" content="" />
    <meta property="og:url" content="https://thatchedroof.github.io/" />
    <title>FUNNY thathc roof world</title>
    <link rel="stylesheet" href="main.css" />
    <link rel="icon" type="image/png" href="" />
</svelte:head>
<h1 id="title">Split text into 2000 characters</h1>
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
        <button type="button" on:click={buttonPress}> Split text </button>
    </li>
</ul>
<div id="output">
    <ul id="items" />
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

    #title {
        margin: 0 auto;
        padding: 1em;
        padding-bottom: 0.5em;
    }

    #items {
        display: flex;
        flex-wrap: wrap;
    }

    .item {
        outline: none;
        border-color: rgb(54, 54, 54);
        border-style: solid;
        border-radius: 2px;
        font-family: inherit;
        font-style: italic;
        font-weight: bold;
        background-color: rgb(43, 43, 43);
        color: rgb(222, 227, 245);
        padding: 0.25em;
        cursor: pointer;
        width: 7em;
        height: 7em;
        margin: 2px;
        /* word-break: break-all; */
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
        padding: 0.25em;
        cursor: pointer;
    }

    button:active {
        background-color: rgb(68, 68, 68);
    }

    .output-item {
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
