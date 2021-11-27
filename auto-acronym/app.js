import { corncob } from './corncob.js';
import { disylls } from './disylls.js';
let cob = corncob.filter((word) => word.length > 2);
console.log(getAcronyms('app index main', disylls, cob).sort((x, y) => y[1] - x[1]));
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
    let score = 1;
    //amount of invalid disylls
    let fails = 1;
    //iterate through disylls
    for (let i = 0; i < inputDisylls.length; i++) {
        //find input disyll in list of disylls
        let index = disylls.findIndex((x) => x[0] === inputDisylls[i]);
        //add to score
        if (index === -1) {
            fails += 1;
            if (fails >= 3) {
                return 0;
            }
        }
        else {
            //adjust for length and multiply into score
            score *= disylls[index][1];
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
        //find word in input
        let index = input.search(corncob[i]);
        //if word is in input
        if (index !== -1) {
            score += corncob[i].length / input.length;
        }
    }
    return score;
}
function totalScore(acro, disylls, corncob) {
    return Math.pow(scoreDisylls(acro, disylls) * scoreCorncob(acro, corncob), 1 / toSylls(acro).length);
}
