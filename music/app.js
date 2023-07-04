import * as monzo from './monzo.js';
console.log('hello');
let context = new AudioContext();
const draw = (guitar, piano) => {
    let div = document.createElement('div');
    let fretMap = [];
    //add id
    div.id = 'guitar';
    document.body.appendChild(div);
    for (let string of guitar) {
        let frets = document.createElement('div');
        frets.className = 'frets';
        div.appendChild(frets);
        let base = string[0];
        let scale = string[1];
        let notes = [];
        let i = 0;
        while (scale.at(i).cents().interval.value <= 2100) {
            notes.push(scale.at(i));
            i++;
        }
        for (let note of notes) {
            console.log(note.inverse().ratio().toString());
        }
        let fretSequence = notes.map(note => note.inverse().ratio().interval.value).reduce((r, e, i, a) => i ? r.concat(a[i - 1] - e) : r, []);
        i = 0;
        let nut = document.createElement('div');
        nut.className = 'fret';
        nut.style.width = '2%';
        nut.style.borderLeft = '';
        nut.style.borderRight = '3px solid rgb(255, 252, 245)';
        fretMap.push([scale.at(base), nut]);
        frets.appendChild(nut);
        for (let size of fretSequence) {
            let fret = document.createElement('div');
            fret.className = 'fret';
            fret.style.width = (size * 98).toString() + '%';
            frets.appendChild(fret);
            let fretNote = scale.at(i + base + 1);
            fretMap.push([fretNote, fret]);
            if (i === 0) {
                fret.style.borderLeft = '3px solid rgb(200, 198, 192)';
            }
            i++;
        }
        for (let [note, fret] of fretMap) {
            let lightness = 45; //26 + Math.floor(note.cents().interval.value / 1200) * 10;
            let hue = (((note.cents().interval.value * 1) % 1200) * (360 / 1200) + 29.23) % 360;
            fret.style.backgroundColor = `oklch(${lightness}% 0.15 ${hue}deg)`; // TODO: Change fret shadow to top right (?) and fix oklch fallback issue
            fret.style.boxShadow = `inset 0px 0px 0px 1px oklch(${lightness - 10}% 0.15 ${hue}deg)`;
            fret.addEventListener('click', () => {
                console.log(note.cents().toString());
                console.log(`oklch(${lightness}% 0.15 ${hue}deg)`);
                // console.log(Ratio(1).concat(Monzo(['-9/12'])).concat(Cents(-1200 * 2)).interval.value as number * 440);
                // setTimeout(function () {
                //     let o = context.createOscillator();
                //     let g = context.createGain();
                //     o.type = 'sawtooth';
                //     o.connect(g);
                //     o.frequency.value = note.ratio().interval.value * 65.40639132514961;
                //     g.connect(context.destination);
                //     o.start(0);
                //     g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1);
                // }, 0);
            });
        }
        console.log(fretSequence.reduce((a, b) => a + b, 0));
        let board = document.createElement('div');
        board.style.width = ((1 - fretSequence.reduce((a, b) => a + b, 0)) * 98).toString() + '%';
        frets.appendChild(board);
        console.log(fretSequence.toString());
    }
    div = document.createElement('div');
    div.id = 'piano';
    document.body.appendChild(div);
    let pianoScale = monzo.EquivScale(piano[0].map((x) => x[2]), piano[1]);
    let subscale = [
        monzo.Monzo(['12/12']),
        monzo.Monzo(['2/12']),
        monzo.Monzo(['4/12']),
        monzo.Monzo(['5/12']),
        monzo.Monzo(['7/12']),
        monzo.Monzo(['9/12']),
        monzo.Monzo(['11/12']),
    ];
    const colorFrets = () => {
        for (let key of piano[0]) {
            let black = false;
            let scaleDegree = subscale.findIndex((x) => x.octEquiv(piano[1]).equals(key[2]));
            if (scaleDegree === -1) {
                black = true;
            }
            let matches = fretMap.filter((x) => x[0].octEquiv(piano[1]).equals(key[2]));
            for (let match of matches) {
                match[1].innerHTML = `<span class="squeeze">${key[1].replace(/[^A-Zb#]/, '')}</span>`;
                if (black) {
                    match[1].style.backgroundColor = `oklch(25% 0 0deg)`;
                    match[1].style.boxShadow = `inset 0px 0px 0px 1px oklch(15% 0 0deg)`;
                }
                else {
                    let hue = ((scaleDegree) * (360 / subscale.length) + 29.23) % 360;
                    match[1].style.backgroundColor = `oklch(45% 0.15 ${hue}deg)`;
                    match[1].style.boxShadow = `inset 0px 0px 0px 1px oklch(35% 0.15 ${hue}deg)`;
                }
            }
        }
    };
    colorFrets();
    const isoKeys = "1qaz2wsx3edc4rfv5tgb6yhn7ujm8ik,9ol.0p;/-[' =]";
    // const isoKeyCodes = isoKeys.split('').map((x) => x.charCodeAt(0));
    subscale = [];
    let oscillators = [];
    const setOsc = () => {
        setTimeout(function () {
            for (let note of subscale) {
                if (oscillators.findIndex((x) => x[0].equals(note)) !== -1) {
                    // console.log(note.toString(), 'already playing');
                    continue;
                }
                else {
                    let o = context.createOscillator();
                    let g = context.createGain();
                    o.type = 'triangle';
                    o.connect(g);
                    let ratio = note.ratio().octEquiv().concat(monzo.Ratio(2));
                    o.frequency.value = ratio.numeric() * 65.40639132514961;
                    g.connect(context.destination);
                    o.start(0);
                    //g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1);
                    g.gain.setValueAtTime(0.00001, context.currentTime + 1);
                    oscillators.push([note, o, g]);
                    console.log(note.toString(), oscillators, note.ratio().toString());
                }
            }
        }, 0);
    };
    const clearOsc = () => {
        setTimeout(function () {
            for (let [note, o, g] of oscillators) {
                if (subscale.findIndex((x) => x.equals(note)) === -1) {
                    console.log(note.toString(), 'stopping');
                    //g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1);
                    g.gain.setValueAtTime(0.00001, context.currentTime + 1);
                    o.stop(context.currentTime + 1);
                    oscillators.splice(oscillators.findIndex((x) => x[0].equals(note)), 1);
                }
            }
        }, 0);
    };
    document.addEventListener('keydown', (event) => {
        if (event.key === ' ') {
            subscale = [];
            colorFrets();
            clearOsc();
            oscillators = [];
            return;
        }
        const key = isoKeys.split('').findIndex((key) => key === event.key);
        if (key !== -1) {
            let column = key % 4;
            let row = Math.floor(key / 4);
            let note = pianoScale.at(column * piano[3] + row * piano[2] - 2);
            subscale.push(note);
            subscale = subscale.filter((x, i) => subscale.findIndex((y) => y.octEquiv(piano[1]).equals(x.octEquiv(piano[1]))) === i);
            //console.log(column, row, column * piano[3] + row * piano[2] - 2, subscale.map((x) => x.toString()));
            setOsc();
        }
        colorFrets();
    });
    document.addEventListener('keyup', (event) => {
        if (event.key === ' ') {
            return;
        }
        const key = isoKeys.split('').findIndex((key) => key === event.key);
        if (key !== -1) {
            let column = key % 4;
            let row = Math.floor(key / 4);
            // subscale.splice(subscale.findIndex((x) => x.equals(pianoScale.at(column * piano[3] + row * piano[2] - 2))), 1);
            subscale = subscale.filter((x, i) => subscale.findIndex((y) => y.equals(x)) === i);
            //console.log(subscale.map((x) => x.toString()));
            clearOsc();
        }
        colorFrets();
    });
};
// E3/68 - B2/63 - G2/59 - D2/54 - A1/49 - E1/44
draw([
    [68 - 40, monzo.edo(12)],
    [63 - 40, monzo.edo(12)],
    [59 - 40, monzo.edo(12)],
    [54 - 40, monzo.edo(12)],
    [49 - 40, monzo.edo(12)],
    [44 - 40, monzo.edo(12)],
], [[
        [0, 'C', monzo.Monzo(['12/12'])],
        [1, 'C#', monzo.Monzo(['1/12'])],
        [0, 'D', monzo.Monzo(['2/12'])],
        [1, 'D#', monzo.Monzo(['3/12'])],
        [0, 'E', monzo.Monzo(['4/12'])],
        [0, 'F', monzo.Monzo(['5/12'])],
        [1, 'F#', monzo.Monzo(['6/12'])],
        [0, 'G', monzo.Monzo(['7/12'])],
        [1, 'G#', monzo.Monzo(['8/12'])],
        [0, 'A', monzo.Monzo(['9/12'])],
        [1, 'A#', monzo.Monzo(['10/12'])],
        [0, 'B', monzo.Monzo(['11/12'])],
    ], monzo.Monzo('2/1'), 2, 1]);
