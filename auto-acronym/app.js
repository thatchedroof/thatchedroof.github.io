import { corncob } from './corncob.js';
import { disylls } from './disylls.js';
let cob = corncob.filter((word) => word.length > 2);
let usedDisylls = [];
//let usedCorncob: string[] = [];
//let lastCorncobAdd = 0;
export function buttonPress(text) {
    let acronyms = getAcronyms(text, disylls, cob).sort((x, y) => y[1] - x[1]);
    console.log(acronyms);
    let acroDiv = document.getElementById('acronyms');
    acroDiv.innerHTML = ``;
    for (let i = 0; i < acronyms.length; i++) {
        if (acroDiv.offsetHeight > 500) {
            console.log('yay', acroDiv.offsetHeight, acronyms[i][0]);
            acroDiv.lastElementChild
                .style.visibility = 'hidden';
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
function getAcronyms(inp, disylls, corncob) {
    //split input into sylls
    let splitInp = String(inp)
        .split(' ')
        .map((x) => x.toLowerCase().split(/([aeiouy]+)/));
    //input is now only first syllables
    let input = splitInp
        .map((x) => x[0] + x[1] + x[2])
        .map((x) => toTitleCase(x));
    //list of acronyms to return
    let out = [];
    //size of each acronym
    let coord = [];
    //initialize acro coord
    for (let i = 0; i < input.length; i++) {
        coord.push(0);
    }
    //function to increment coord
    function inc(coord, input) {
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
        }
        catch (e) {
            break;
        }
    }
    return out;
}
function toTitleCase(inp) {
    return inp.charAt(0).toUpperCase() + inp.slice(1).toLowerCase();
}
function toSylls(inp) {
    //split into sylls
    let input = inp.toLowerCase().split(/([aeiouy]+)/);
    //add ^ and $ to beginning and end
    let out = ['^'.concat(input[0])]
        .concat(input.slice(1, input.length - 1))
        .concat([input[input.length - 1].concat('$')]);
    return out;
}
function toDisylls(inp) {
    let sylls = toSylls(inp);
    //list of disylls to return
    let out = [];
    //iterate through each disyll and append to out
    for (let i = 0; i < sylls.length - 1; i++) {
        out.push(sylls[i] + sylls[i + 1]);
    }
    return out;
}
function scoreDisylls(inp, disylls) {
    let inputDisylls = toDisylls(inp);
    //let score: number = 1;
    //amount of invalid disylls
    let fails = 1;
    //iterate through disylls
    for (let i = 0; i < inputDisylls.length; i++) {
        //find input disyll in list of used disylls
        let index = usedDisylls.findIndex((x) => x[0] === inputDisylls[i]);
        //if not in usedDisylls
        if (index === -1) {
            let index = disylls.findIndex((x) => x[0] === inputDisylls[i]);
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
        }
        else {
            //adjust for length and multiply into score
            //score *= disylls[index][1];
        }
    }
    //root by length
    return 1 / fails; //Math.pow(score, 1/inputDisylls.length)
}
function scoreCorncob(inp, corncob) {
    let input = inp.toLowerCase();
    let score = 0;
    //iterate through every word
    for (let i = 0; i < corncob.length; i++) {
        let word = corncob[i];
        //find word in input
        let index = input.search(word);
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
function totalScore(acro, disylls, corncob) {
    //console.time('di');
    let di = scoreDisylls(acro, disylls);
    //console.timeEnd('di');
    let co = 0;
    if (di !== 0) {
        //console.time('co');
        co = scoreCorncob(acro, corncob);
        //console.timeEnd('co');
    }
    return Math.pow(di * co, 1 / toSylls(acro).length);
}
