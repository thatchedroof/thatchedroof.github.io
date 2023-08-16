<script lang="ts">
    import { onMount } from 'svelte';

    onMount(() => {
        let mouseDown = 0;
        document.body.onmousedown = function () {
            mouseDown = 1;
            document.body.onmouseup = function () {
                mouseDown = 0;
            };
        };

        const flipped = Array(10).fill(0);
        let tempFlipped = Array(10).fill(0);
        let r1: number;
        let r2: number;
        let roll: number;

        const root = document.querySelector(':root')!;
        const die1 = document.querySelector('#die1')!;
        const die2 = document.querySelector('#die2')!;

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
            changeDieState(die1, r1);

            r2 = Math.floor(Math.random() * 6) + 1;
            changeDieState(die2, r2);

            roll = r1 + r2;
        }

        /**
         * Starts the page timer
         */
        function starttimer() {
            timerInterval = setInterval(function () {
                var delta = Date.now() - start;
                let timer = document.getElementById('timer')!;
                timer.innerHTML = (Math.floor(delta / 100) / 10).toFixed(1);
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
        function resettimer() {}

        //die1.addEventListener("animationiteration", changeAnimation)
        //die1.addEventListener("click", rolldie1)
        //die2.addEventListener("animationiteration", changeAnimation)
        //die2.addEventListener("click", rolldie2)

        //changeAnimation()

        /**
         * @param  {} ele
         * @param  {} md=false
         *
         * Flips a single element
         */
        function flip(ele: HTMLElement, md = false) {
            if ((mouseDown || md) && !ele.classList.contains('flip-real-up')) {
                if (ele.classList.contains('flip-up')) {
                    tempFlipped[parseInt(ele.id.substring(1)) - 1] = 0;
                    buttonUpdate();
                } else {
                    tempFlipped[parseInt(ele.id.substring(1)) - 1] = parseInt(
                        ele.id.substring(1),
                    );
                    buttonUpdate();
                }
                ele.classList.toggle('flip-down');
                ele.classList.toggle('flip-up');
            }
        }

        function buttonUpdate() {
            const b = document.getElementById('sum-button')!;
            b.innerHTML =
                String(tempFlipped.reduce((a, b) => a + b, 0)) +
                ' / ' +
                String(roll);
            if (tempFlipped.reduce((a, b) => a + b, 0) === roll) {
                b.classList.remove('sum-button-not-allowed');
                b.classList.add('sum-button-allowed');
            } else {
                b.classList.remove('sum-button-allowed');
                b.classList.add('sum-button-not-allowed');
            }
        }

        function flippedUpdate() {
            let ele;
            for (let i = 0; i < flipped.length; i++) {
                if (flipped[i] !== 0) {
                    ele = document.getElementById('f' + String(flipped[i]))!;
                    ele.innerHTML = '';
                    ele.classList.remove('flip-down');
                    ele.classList.remove('flip-up');
                    ele.classList.add('flip-real-up');
                }
            }
        }

        function rolldie1() {
            die1.removeEventListener('animationiteration', changeAnimation);
            die1.removeEventListener('click', rolldie1);
            (die1 as HTMLElement).style.animation = 'linear .001';
            (die1 as HTMLElement).style.transform = 'translate(0, 0);';
            r1 = Math.floor(Math.random() * 6) + 1;
            changeDieState(die1, r1);
            if (typeof r2 !== 'undefined') {
                roll = r1 + r2;
                buttonUpdate();
            }
        }

        function rolldie2() {
            die2.removeEventListener('animationiteration', changeAnimation);
            die2.removeEventListener('click', rolldie2);
            (die2 as HTMLElement).style.animation = 'linear .001';
            (die2 as HTMLElement).style.transform = 'translate(0, 0);';
            r2 = Math.floor(Math.random() * 6) + 1;
            changeDieState(die2, r2);
            if (typeof r1 !== 'undefined') {
                roll = r1 + r2;
                buttonUpdate();
            }
        }

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
                document.getElementById('sum-button')!.innerHTML = 'You Win!';
            } else {
                reroll();
                buttonUpdate();
            }
        }

        function changeAnimation() {
            changeDieState(die1, Math.floor(Math.random() * 6) + 1);
            changeDieState(die2, Math.floor(Math.random() * 6) + 1);
            const shakeStrength = 10;
            let die1pixelsx = (Math.random() - 0.5) * shakeStrength;
            let die1pixelsy = (Math.random() - 0.5) * shakeStrength;
            let die2pixelsx = (Math.random() - 0.5) * shakeStrength;
            let die2pixelsy = (Math.random() - 0.5) * shakeStrength;

            document.getElementById('keyframe-style')!.innerHTML =
                '@keyframes shake-die1 {100% {transform: translate(' +
                Math.round(die1pixelsx * 100) / 100 +
                'px, ' +
                Math.round(die1pixelsy * 100) / 100 +
                'px);}}\n@keyframes shake-die2 {100% {transform: translate(' +
                Math.round(die2pixelsx * 100) / 100 +
                'px, ' +
                Math.round(die2pixelsy * 100) / 100 +
                'px);}}';

            console.log(die1pixelsx, die1pixelsy, die2pixelsx, die2pixelsy);
        }

        function changeDieState(die: Element, state: number) {
            const pipClasses = ['one', 'two', 'three', 'four', 'five', 'six'];
            let pips = die.querySelectorAll('.pip');
            console.log(pips);
            for (let j = 0; j < pips.length; j++) {
                pips[j].setAttribute('fill', '#FFF1DC');
            }
            let numPips = die.querySelectorAll('.' + pipClasses[state - 1]);
            console.log(numPips);
            for (let j = 0; j < numPips.length; j++) {
                numPips[j].setAttribute('fill', '#1F1F1F');
            }
        }
    });
</script>

<svelte:head>
    <meta charset="utf-8" />
    <meta name="twitter:card" content="summary" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="FLIPING DICE GAME" />
    <meta property="og:description" content="beta mode (funtesting :)" />
    <meta
        property="og:image"
        content="https://thatchedroof.github.io/partition-game/diecon.png"
    />
    <meta
        property="og:url"
        content="https://thatchedroof.github.io/partition-game/"
    />
    <title>thathc roof world FLIPING DICE GAME</title>
    <style id="keyframe-style">
        @keyframes shake {
            100% {
                transform: translate(100px, 100px);
            }
        }
    </style>
</svelte:head>

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
            <rect
                id="die-highlight"
                width="84"
                height="84"
                rx="18"
                fill="#FFFAF4"
            />
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
                    <path
                        id="die-shadow-mask"
                        d="M84 0V84H0L84 0Z"
                        fill="#C4C4C4"
                    />
                </mask>
                <g mask="url(#mask0)">
                    <rect
                        id="die-shadow"
                        width="84"
                        height="84"
                        rx="18"
                        fill="#E3D7C5"
                    />
                </g>
            </g>
            <rect
                id="front-face"
                x="4"
                y="4"
                width="76"
                height="76"
                rx="17"
                fill="#FFF1DC"
            />
        </g>
        <g id="die-pips">
            <circle
                id="pip-7"
                class="pip four five six"
                cx="62"
                cy="22"
                r="6"
                fill="#1F1F1F"
            />
            <circle
                id="pip-6"
                class="pip two three four five six"
                cx="62"
                cy="62"
                r="6"
                fill="#1F1F1F"
            />
            <circle
                id="pip-5"
                class="pip six"
                cx="62"
                cy="42"
                r="6"
                fill="#1F1F1F"
            />
            <circle
                id="pip-4"
                class="pip two three four five six"
                cx="22"
                cy="22"
                r="6"
                fill="#1F1F1F"
            />
            <circle
                id="pip-3"
                class="pip four five six"
                cx="22"
                cy="62"
                r="6"
                fill="#1F1F1F"
            />
            <circle
                id="pip-2"
                class="pip six"
                cx="22"
                cy="42"
                r="6"
                fill="#1F1F1F"
            />
            <circle
                id="pip-1"
                class="pip one three five"
                cx="42"
                cy="42"
                r="6"
                fill="#1F1F1F"
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
            <rect
                id="die-highlight"
                width="84"
                height="84"
                rx="18"
                fill="#FFFAF4"
            />
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
                    <path
                        id="die-shadow-mask"
                        d="M84 0V84H0L84 0Z"
                        fill="#C4C4C4"
                    />
                </mask>
                <g mask="url(#mask0)">
                    <rect
                        id="die-shadow"
                        width="84"
                        height="84"
                        rx="18"
                        fill="#E3D7C5"
                    />
                </g>
            </g>
            <rect
                id="front-face"
                x="4"
                y="4"
                width="76"
                height="76"
                rx="17"
                fill="#FFF1DC"
            />
        </g>
        <g id="die-pips">
            <circle
                id="pip-7"
                class="pip four five six"
                cx="62"
                cy="22"
                r="6"
                fill="#1F1F1F"
            />
            <circle
                id="pip-6"
                class="pip two three four five six"
                cx="62"
                cy="62"
                r="6"
                fill="#1F1F1F"
            />
            <circle
                id="pip-5"
                class="pip six"
                cx="62"
                cy="42"
                r="6"
                fill="#1F1F1F"
            />
            <circle
                id="pip-4"
                class="pip two three four five six"
                cx="22"
                cy="22"
                r="6"
                fill="#1F1F1F"
            />
            <circle
                id="pip-3"
                class="pip four five six"
                cx="22"
                cy="62"
                r="6"
                fill="#1F1F1F"
            />
            <circle
                id="pip-2"
                class="pip six"
                cx="22"
                cy="42"
                r="6"
                fill="#1F1F1F"
            />
            <circle
                id="pip-1"
                class="pip one three five"
                cx="42"
                cy="42"
                r="6"
                fill="#1F1F1F"
            />
        </g>
    </svg>
    <div
        id="f1"
        class="flip-down"
        on:mouseenter={() => flip(this)}
        on:mousedown={() => flip(this, true)}
    >
        1
    </div>
    <div
        id="f2"
        class="flip-down"
        on:mouseenter={() => flip(this)}
        on:mousedown={() => flip(this, true)}
    >
        2
    </div>
    <div
        id="f3"
        class="flip-down"
        on:mouseenter={() => flip(this)}
        on:mousedown={() => flip(this, true)}
    >
        3
    </div>
    <div
        id="f4"
        class="flip-down"
        on:mouseenter={() => flip(this)}
        on:mousedown={() => flip(this, true)}
    >
        4
    </div>
    <div
        id="f5"
        class="flip-down"
        on:mouseenter={() => flip(this)}
        on:mousedown={() => flip(this, true)}
    >
        5
    </div>
    <div
        id="f6"
        class="flip-down"
        on:mouseenter={() => flip(this)}
        on:mousedown={() => flip(this, true)}
    >
        6
    </div>
    <div
        id="f7"
        class="flip-down"
        on:mouseenter={() => flip(this)}
        on:mousedown={() => flip(this, true)}
    >
        7
    </div>
    <div
        id="f8"
        class="flip-down"
        on:mouseenter={() => flip(this)}
        on:mousedown={() => flip(this, true)}
    >
        8
    </div>
    <div
        id="f9"
        class="flip-down"
        on:mouseenter={() => flip(this)}
        on:mousedown={() => flip(this, true)}
    >
        9
    </div>
    <div
        id="f10"
        class="flip-down"
        on:mouseenter={() => flip(this)}
        on:mousedown={() => flip(this, true)}
    >
        10
    </div>
    <div
        id="sum-button"
        class="sum-button-not-allowed"
        on:click={() => {
            if (this.classList.contains('sum-button-allowed')) sumButtonClick();
        }}
    />
    <div id="timer">0</div>
</div>
<noscript>ENABLE JAVASCRIPT RIGHT NOW</noscript>

<style>
    :root {
        background-color: rgb(31, 31, 31);
        color: rgb(31, 31, 31);
    }

    :global(body) {
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
