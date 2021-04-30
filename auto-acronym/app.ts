import { corncob } from './corncob.js';

import { disylls } from './disylls.js';

let cob: string[] = corncob.filter((word: string) => word.length > 2);

console.log(
    getAcronyms('app index main', disylls, cob).sort((x, y) => y[1] - x[1]),
);

function getAcronyms(
    inp: string,
    disylls: [string, number][],
    corncob: string[],
): [string, number][] {
    //split input into sylls
    let splitInp: string[][] = String(inp)
        .split(' ')
        .map((x: string) => x.toLowerCase().split(/([aeiouy]+)/));

    //input is now only first syllables
    let input: string[] = splitInp
        .map((x: string[]) => x[0] + x[1] + x[2])
        .map((x: string) => toTitleCase(x));

    //list of acronyms to return
    let out: [string, number][] = [];

    //size of each acronym
    let coord: number[] = [];

    //initialize acro coord
    for (let i = 0; i < input.length; i++) {
        coord.push(0);
    }

    //function to increment coord
    function inc(coord: number[], input: string[]) {
        let i: number = 0;

        while (input[i].length - 1 === coord[i]) {
            coord[i] = 0;
            i++;
        }

        coord[i] = coord[i] + 1;

        return coord;
    }

    //loop through each possible acronym
    while (true) {
        let acro: string = '';

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
    let input: string[] = inp.toLowerCase().split(/([aeiouy]+)/);

    //add ^ and $ to beginning and end
    let out: string[] = ['^'.concat(input[0])]
        .concat(input.slice(1, input.length - 1))
        .concat([input[input.length - 1].concat('$')]);

    return out;
}

function toDisylls(inp: string): string[] {
    let sylls: string[] = toSylls(inp);

    //list of disylls to return
    let out: string[] = [];

    //iterate through each disyll and append to out
    for (let i = 0; i < sylls.length - 1; i++) {
        out.push(sylls[i] + sylls[i + 1]);
    }

    return out;
}

function scoreDisylls(inp: string, disylls: [string, number][]): number {
    let inputDisylls: string[] = toDisylls(inp);

    let score: number = 1;

    //amount of invalid disylls
    let fails: number = 1;

    //iterate through disylls
    for (let i = 0; i < inputDisylls.length; i++) {
        //find input disyll in list of disylls
        let index: number = disylls.findIndex(
            (x: [string, number]) => x[0] === inputDisylls[i],
        );

        //add to score
        if (index === -1) {
            fails += 1;

            if (fails >= 3) {
                return 0;
            }
        } else {
            //adjust for length and multiply into score
            score *= disylls[index][1];
        }
    }

    //root by length
    return 1 / fails; //Math.pow(score, 1/inputDisylls.length)
}

function scoreCorncob(inp: string, corncob: string[]): number {
    let input: string = inp.toLowerCase();

    let score: number = 0;

    //iterate through every word
    for (let i = 0; i < corncob.length; i++) {
        //find word in input
        let index: number = input.search(corncob[i]);

        //if word is in input
        if (index !== -1) {
            score += corncob[i].length / input.length;
        }
    }

    return score;
}

function totalScore(
    acro: string,
    disylls: [string, number][],
    corncob: string[],
): number {
    return Math.pow(
        scoreDisylls(acro, disylls) * scoreCorncob(acro, corncob),
        1 / toSylls(acro).length,
    );
}
