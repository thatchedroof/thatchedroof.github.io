<script lang="ts">
    // TODO: Canvas needs to be position: fixed but for some reason this isn't working
    import { base } from '$app/paths';
    import Matter from 'matter-js';
    import { onMount } from 'svelte';

    let formatDate: string;
    onMount(() => {
        console.log('gy');

        let today;
        let theDay;
        let selectElement;

        Matter.use('matter-wrap');

        function updateTime() {
            today = new Date();
            theDay = new Date('2021-08-11T14:26:00Z');
            formatDate = dateDiffFormatted(today, theDay);
        }

        function dateDiffFormatted(a: Date, b: Date) {
            const utc1 = Date.UTC(
                a.getUTCFullYear(),
                a.getUTCMonth(),
                a.getUTCDate(),
                a.getUTCHours(),
                a.getUTCMinutes(),
                a.getUTCSeconds(),
                a.getUTCMilliseconds(),
            );
            const utc2 = Date.UTC(
                b.getUTCFullYear(),
                b.getUTCMonth(),
                b.getUTCDate(),
                b.getUTCHours(),
                b.getUTCMinutes(),
                b.getUTCSeconds(),
                b.getUTCMilliseconds(),
            );

            const days = Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
            const hours = Math.floor((utc2 - utc1) / (1000 * 60 * 60));
            const minutes = Math.floor((utc2 - utc1) / (1000 * 60));
            const seconds = Math.floor((utc2 - utc1) / 1000);
            const milliseconds = utc2 - utc1;
            return (
                String(days) +
                ':' +
                String(hours % 24).padStart(2, '0') +
                ':' +
                String(minutes % 60).padStart(2, '0') +
                ':' +
                String(seconds % 60).padStart(2, '0') +
                ':' +
                String(milliseconds % 1000).padStart(3, '0')
            );
        }

        function topFunction() {
            document.body.scrollTop = 0; // For Safari
            document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        }

        setInterval(updateTime, 1);

        // module aliases
        const Engine = Matter.Engine;
        const Render = Matter.Render;
        const World = Matter.World;
        const Bodies = Matter.Bodies;

        const canvas = document.getElementById('matterJS')!;

        canvas.style.position = 'fixed';

        // create an engine
        const engine = Engine.create({
            // @ts-ignore
            element: document.body,
            canvas: canvas,
        });

        const width = window.innerWidth;
        const height = window.innerHeight;

        // create a renderer
        const render = Render.create({
            element: document.body,
            engine: engine,
            options: {
                width: width,
                height: height,
                background: 'transparent',
                wireframes: false,
            },
        });

        // create two boxes and a ground
        // const boxA = Bodies.rectangle(400, 200, 80, 80, { render: { fillStyle: 'crimson' }, plugin: { wrap: { min: { x: 0, y: 0 }, max: { x: width, y: height } } } })
        // const boxB = Bodies.rectangle(450, 50, 80, 80, { render: { fillStyle: 'royalblue' }, plugin: { wrap: { min: { x: 0, y: 0 }, max: { x: width, y: height } } } })

        function toMidCoords(
            x: number,
            y: number,
            wsize: number,
            hsize: number,
        ): [number, number, number, number] {
            return [x + wsize / 2, y + hsize / 2, wsize, hsize];
        }

        function betterStack(
            vw: number,
            vh: number,
            size: number,
            columns: number,
            rows: number,
            color1: string,
            color2: string,
        ) {
            let whichColor = true;
            const startingX = width * vw;
            const startingY = height - size * width - height * vh;
            return Matter.Composites.stack(
                startingX,
                startingY,
                columns,
                rows,
                0,
                0,
                function (x: number, y: number) {
                    whichColor = !whichColor;
                    if (whichColor) {
                        return Bodies.rectangle(
                            x,
                            y,
                            (size * width) / columns,
                            (size * width) / rows,
                            {
                                render: { fillStyle: color1 },
                                plugin: {
                                    wrap: {
                                        min: { x: 0, y: 0 },
                                        max: { x: width, y: height },
                                    },
                                },
                            },
                        );
                    } else {
                        return Bodies.rectangle(
                            x,
                            y,
                            (size * width) / columns,
                            (size * width) / rows,
                            {
                                render: { fillStyle: color2 },
                                plugin: {
                                    wrap: {
                                        min: { x: 0, y: 0 },
                                        max: { x: width, y: height },
                                    },
                                },
                            },
                        );
                    }
                },
            );
        }

        function betterRectangle(
            vw: number,
            vh: number,
            wsize: number,
            hsize: number,
            color: string,
        ) {
            const startingX = width * vw;
            const startingY = height * vh;
            console.log(width, height, startingX, startingY);
            return Bodies.rectangle(
                ...toMidCoords(
                    startingX,
                    startingY,
                    wsize * width,
                    hsize * height,
                ),
                {
                    render: { fillStyle: color },
                    plugin: {
                        wrap: {
                            min: { x: 0, y: 0 },
                            max: { x: width, y: height },
                        },
                    },
                },
            );
        }

        function betterSquare(
            vw: number,
            vh: number,
            size: number,
            color: string,
        ) {
            const startingX = (2 * width * vw + size * width) / 2;
            const startingY = (2 * height - size * width) / 2 - height * vh;
            console.log(width, height, startingX, startingY);
            return Bodies.rectangle(
                startingX,
                startingY,
                size * width,
                size * width,
                {
                    render: { fillStyle: color },
                    plugin: {
                        wrap: {
                            min: { x: 0, y: 0 },
                            max: { x: width, y: height },
                        },
                    },
                },
            );
        }

        const boxA = betterSquare(1 / 10, 1 / 10, 1 / 10, 'crimson');
        const boxB = betterSquare(1 / 10, 2 / 10, 1 / 10, 'royalblue');
        const rectA = betterRectangle(
            1 / 10,
            3 / 10,
            3 / 10,
            1 / 30,
            'greenyellow',
        );

        console.log(boxA);

        const stack = betterStack(
            7 / 10 - 0.001,
            0,
            3 / 10,
            9,
            9,
            'crimson',
            'royalblue',
        );

        const mouse = Matter.Mouse.create(render.canvas);
        const mouseConstraint = Matter.MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                render: { visible: false },
                // @ts-ignore
                angularStiffness: 0,
                stiffness: 0.9,
            },
        });

        render.mouse = mouse;

        mouseConstraint.mouse.element.removeEventListener(
            'mousewheel',
            // @ts-ignore
            mouseConstraint.mouse.mousewheel,
        );
        mouseConstraint.mouse.element.removeEventListener(
            'DOMMouseScroll',
            // @ts-ignore
            mouseConstraint.mouse.mousewheel,
        );

        const borderSize = 500;

        const xOrigin = 0;
        const yOrigin = 0;

        World.add(engine.world, [
            boxA,
            boxB,
            rectA,
            stack,
            // top
            Bodies.rectangle(
                xOrigin + width / 2,
                yOrigin + -borderSize / 2,
                2 * borderSize + width,
                borderSize - 1,
                {
                    isStatic: true,
                    render: { fillStyle: 'white' },
                },
            ),
            // right
            Bodies.rectangle(
                xOrigin + width + borderSize / 2,
                yOrigin + height / 2,
                borderSize,
                2 * borderSize + height,
                {
                    isStatic: true,
                    render: { fillStyle: 'white' },
                },
            ),
            // bottom
            Bodies.rectangle(
                xOrigin + width / 2,
                yOrigin + height + borderSize / 2,
                2 * borderSize + width,
                borderSize + 1,
                {
                    isStatic: true,
                    render: { fillStyle: 'white' },
                },
            ),
            // left
            Bodies.rectangle(
                xOrigin - borderSize / 2,
                yOrigin + height / 2,
                borderSize,
                2 * borderSize + height,
                {
                    isStatic: true,
                    render: { fillStyle: 'white' },
                },
            ),
            mouseConstraint,
        ]);

        // run the engine
        Matter.Runner.run(engine);

        // run the renderer
        Render.run(render);

        console.log('gy');
    });
</script>

<svelte:head>
    <meta charset="utf-8" />
    <title>thathc roof world</title>
</svelte:head>

<canvas id="matterJS" />
<h1 style="padding: 3.5px 10px 10px 10px; margin: 0">
    welcome to thanct roofs world!
</h1>
<h1
    id="date"
    class="bigtimer"
    style="margin-bottom: calc(50vh - 57.2px); margin-top: calc(50vh - 49.5px - 57.2px)"
>
    {formatDate}
</h1>
<div class="black-section">
    <h1 id="funny-the">THE</h1>
    <p>
        fwnefua0efejaefa0fjw0ef7hahuonhvamhrv078hkr08ahg6ergfjagjfawgjef66awgfjaw0eyfkaw0efhaw6egfabym9uybvm9abd9aten7mfmaoauherfouabmnygbrncvmosurmsprhgs7478mhf7g4hmw70hfuybsnouvbmyibnbanocewuvjcpa8efca6436ghehfa8phjemfm7haefgahevcnaevc874n365nhfonhvpachmpahfaefh7a84gn694gfn8aha87h3ap8foaymnerv80ahm3ybghmouhcmservngaivouaepvnapmrvhaervhmaourvarmvyuoah479cw649cgtw074t6jhw4c79gtqn65g36g26g7fhwn64c7w4n7yt85pmhgw0875hnc6w734chmhrcbyfmyuecwph4fw7ffmufcfbtysbaaeoyefuarfmmuivrnlesarvayuprfmaywbmrmybmcrucabmrovbow74h37g4wmghywbmobyfcuowbmcaob47ih78o34hcn65y6gwubrmcnbw347nhtcnwthw348c7thtw0p4htcw34ncw9349cgt93w47cthw3chqphmq4htq4gm46qgcm94c6g4thq478cmuecmhpechmpmeuhmpqh3mc8pqhc7hq4ciecmhc370qhdm7uchhdq67mhc4mcqhquehmce07qh470rhq3ucemumhcdchm087qh4mchqccf67ngh7ghwmmc8q60cghqhdqcecq7nce7q84hc647c08mhcyrchmoucamoatcerhmaohcraw874hm0c742cm4874cmp8chrmrcuarhmcyarhcm87a4mc437hmc8dhcauimhoawrhcm7rc478h8q74cmuorecoyarmcrh3429cn4695hf8cmapchr97h243c78h4cn68h8dchm874mhcobmrf8bamc873mhc087w4hcm7f8hmch7fmw0847cmh64ghtm5ybgmcmbgm0cwpajcr8racdpham3c70hw3c8y46g367hjpwnfhywcnywnb7yhc48ghqa987h3w7ngh2nqghnn4c9gq946cgq8ch466hjfw084cpmw834hcn9w34cgnhw67gntcfww80phcn8w3hc4gwhp87chr7ghwnc76wn67gc59a7hncoa37c3y87n4co87gfn8c4h76gfhyucnhouhrcnoayucg7gnyhc83hcoaghdcyubgyuscpu4w47c8ch487cgnw76gcnh4gryu4cnw4387nhcw478nh4ncrhwro8h4c7gt4nw874nhc76g4nyucgwoycnbhwf6erhfwnefua0efejaefa0fjw0ef7hahuonhvamhrv078hkr08ahg6ergfjagjfawgjef66awgfjaw0eyfkaw0efhaw6egfabym9uybvm9abd9aten7mfmaoauherfouabmnygbrncvmosurmsprhgs7478mhf7g4hmw70hfuybsnouvbmyibnbanocewuvjcpa8efca6436ghehfa8phjemfm7haefgahevcnaevc874n365nhfonhvpachmpahfaefh7a84gn694gfn8aha87h3ap8foaymnerv80ahm3ybghmouhcmservngaivouaepvnapmrvhaervhmaourvarmvyuoah479cw649cgtw074t6jhw4c79gtqn65g36g26g7fhwn64c7w4n7yt85pmhgw0875hnc6w734chmhrcbyfmyuecwph4fw7ffmufcfbtysbaaeoyefuarfmmuivrnlesarvayuprfmaywbmrmybmcrucabmrovbow74h37g4wmghywbmobyfcuowbmcaob47ih78o34hcn65y6gwubrmcnbw347nhtcnwthw348c7thtw0p4htcw34ncw9349cgt93w47cthw3chqphmq4htq4gm46qgcm94c6g4thq478cmuecmhpechmpmeuhmpqh3mc8pqhc7hq4ciecmhc370qhdm7uchhdq67mhc4mcqhquehmce07qh470rhq3ucemumhcdchm087qh4mchqccf67ngh7ghwmmc8q60cghqhdqcecq7nce7q84hc647c08mhcyrchmoucamoatcerhmaohcraw874hm0c742cm4874cmp8chrmrcuarhmcyarhcm87a4mc437hmc8dhcauimhoawrhcm7rc478h8q74cmuorecoyarmcrh3429cn4695hf8cmapchr97h243c78h4cn68h8dchm874mhcobmrf8bamc873mhc087w4hcm7f8hmch7fmw0847cmh64ghtm5ybgmcmbgm0cwpajcr8racdpham3c70hw3c8y46g367hjpwnfhywcnywnb7yhc48ghqa987h3w7ngh2nqghnn4c9gq946cgq8ch466hjfw084cpmw834hcn9w34cgnhw67gntcfww80phcn8w3hc4gwhp87chr7ghwnc76wn67gc59a7hncoa37c3y87n4co87gfn8c4h76gfhyucnhouhrcnoayucg7gnyhc83hcoaghdcyubgyuscpu4w47c8ch487cgnw76gcnh4gryu4cnw4387nhcw478nh4ncrhwro8h4c7gt4nw874nhc76g4nyucgwoycnbhwf6erh
    </p>
    <div class="black-section-footer">helo. up?</div>
</div>
<noscript>ENABLE JAVASCRIPT RIGHT NOW</noscript>

<style>
    :global(body) {
        font-family: sans-serif;
        margin: 0;
        overflow-wrap: break-word;
    }

    .list {
        list-style: square;
    }

    .bigtimer {
        text-align: center;
        color: crimson;
        font-style: italic;
        font-weight: bold;
        text-shadow: 2px 2px 2px crimson;
        font-size: 100px;
    }

    .black-section {
        background-color: rgb(31, 31, 31);
        width: 100%;
        height: 100%;
        color: rgb(222, 227, 245);
        margin: 0;
    }

    .black-section h1 {
        text-align: center;
        color: royalblue;
        font-style: italic;
        font-weight: bold;
        text-shadow: 2px 2px 2px greenyellow;
        font-size: 100px;
        margin: 0;
        padding: 20px;
    }

    .black-section p {
        color: rgb(222, 227, 245);
        font-family: monospace;
        font-size: 25px;
        margin-left: 35vw;
        margin-right: 35vw;
        margin-top: 0;
    }

    .black-section-footer {
        padding: 5px;
        margin-bottom: 0;
        cursor: pointer;
    }

    .black-section-footer:hover {
        color: #555;
    }

    #funny-the {
        padding-top: 45px;
        padding-bottom: 75px;
    }

    canvas {
        position: fixed;
        bottom: 0;
        right: 0;
    }

    #matterJS {
        position: fixed;
        bottom: 0;
        right: 0;
    }
</style>
