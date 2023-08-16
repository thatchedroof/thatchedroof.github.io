<script lang="ts">
    let vw = window.innerWidth;
    let vh = window.innerHeight;
    let mainText;
    const asciiGrayscale =
        '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'.';

    function updateScreenSize() {
        vw = window.innerWidth;
        vh = window.innerHeight;
    }

    function updateScreen() {
        updateScreenSize();
        mainText = document.getElementById('main-text')!;
        const charWidth = Math.floor(vw / 13.9);
        const charHeight = Math.floor(vh / 30.5);
        console.log(
            vw.toString(),
            vh.toString(),
            charWidth.toString(),
            charHeight.toString(),
        );
        let text = '';
        for (let i = 0; i < charHeight; i++) {
            for (let j = 0; j < charWidth; j++) {
                text +=
                    asciiGrayscale[
                        Math.floor(Math.random() * asciiGrayscale.length)
                    ];
            }
            text += '\n';
        }
        mainText.innerHTML = text
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    updateScreen();
    setInterval(updateScreen, 10);
</script>

<svelte:head>
    <meta charset="utf-8" />
    <title>thathc roof PICTUNR GAME</title>
    <link rel="stylesheet" href="main.css" />
    <link
        rel="icon"
        type="image/png"
        href="https://cdn.discordapp.com/avatars/471354140639887400/44c9c22ebd692580a5b8476efb361c04.png"
    />
</svelte:head>

<div id="main-text">main text</div>
<noscript>ENABLE JAVASCRIPT RIGHT NOW</noscript>

<style>
    :global(body) {
        background-color: rgb(31, 31, 31);
        color: rgb(222, 227, 245);
        font-family: monospace;
        font-size: 25px;
        margin: 0;
        margin-block-start: 0;
        margin-block-end: 0;
        overflow-wrap: break-word;
    }

    div {
        text-align: center;
        margin: 0;
        margin-block-start: 0;
        margin-block-end: 0;
    }
</style>
