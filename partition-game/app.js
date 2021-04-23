'use strict'

let mouseDown = 0
document.body.onmousedown = function() {
    mouseDown = 1
    document.body.onmouseup = function() {
        mouseDown = 0
    }
}

const flipped = Array(10).fill(0)
let tempFlipped = Array(10).fill(0)
let r1
let r2
let roll

const root = document.querySelector(':root')
const die1 = document.querySelector('#die1')
const die2 = document.querySelector('#die2')

reroll()
buttonUpdate()

let start = Date.now()
starttimer()

function reroll() {
    r1 = Math.floor(Math.random() * 6) + 1
    changeDieState(die1, r1)

    r2 = Math.floor(Math.random() * 6) + 1
    changeDieState(die2, r2)

    roll = r1 + r2
}

function starttimer() {
    setInterval(function() {
        var delta = Date.now() - start
        Math.floor(delta / 1000)
    }, 1000)
}

function stoptimer() {

}

function resettimer() {

}

//die1.addEventListener("animationiteration", changeAnimation)
//die1.addEventListener("click", rolldie1)
//die2.addEventListener("animationiteration", changeAnimation)
//die2.addEventListener("click", rolldie2)

//changeAnimation()

function flip(ele, md = false) {
    if ((mouseDown || md) && !ele.classList.contains('flip-real-up')) {
        if (ele.classList.contains('flip-up')) {
            tempFlipped[ele.id.substring(1) - 1] = 0
            buttonUpdate()
        } else {
            tempFlipped[ele.id.substring(1) - 1] = parseInt(ele.id.substring(1))
            buttonUpdate()
        }
        ele.classList.toggle('flip-down')
        ele.classList.toggle('flip-up')
    }
}

function buttonUpdate() {
    const b = document.getElementById('sum-button')
    b.innerHTML = String(tempFlipped.reduce((a, b) => a + b, 0)) + ' / ' + String(roll)
    if (tempFlipped.reduce((a, b) => a + b, 0) === roll) {
        b.classList.remove('sum-button-not-allowed')
        b.classList.add('sum-button-allowed')
    } else {
        b.classList.remove('sum-button-allowed')
        b.classList.add('sum-button-not-allowed')
    }
}

function flippedUpdate() {
    let ele
    for (let i = 0; i < flipped.length; i++) {
        if (flipped[i] !== 0) {
            ele = document.getElementById('f' + String(flipped[i]))
            ele.innerHTML = ''
            ele.classList.remove('flip-down')
            ele.classList.remove('flip-up')
            ele.classList.add('flip-real-up')
        }
    }
}

function rolldie1() {
    die1.removeEventListener("animationiteration", changeAnimation)
    die1.removeEventListener("click", rolldie1)
    die1.style.animation = "linear .001"
    die1.style.transform = "translate(0, 0);"
    r1 = Math.floor(Math.random() * 6) + 1
    changeDieState(die1, r1)
    if (typeof r2 !== "undefined") {
        roll = r1 + r2
        buttonUpdate()
    }
}

function rolldie2() {
    die2.removeEventListener("animationiteration", changeAnimation)
    die2.removeEventListener("click", rolldie2)
    die2.style.animation = "linear .001"
    die2.style.transform = "translate(0, 0);"
    r2 = Math.floor(Math.random() * 6) + 1
    changeDieState(die2, r2)
    if (typeof r1 !== "undefined") {
        roll = r1 + r2
        buttonUpdate()
    }
}

function sumButtonClick() {
    for (let i = 0; i < flipped.length; i++) {
        if (flipped[i] === 0) {
            flipped[i] = tempFlipped[i]
        }
    }
    flippedUpdate()
    tempFlipped = Array(10).fill(0)
    if (flipped.every(e => e)) {
        document.getElementById('sum-button').innerHTML = 'You Win!'
    } else {
        reroll()
        buttonUpdate()
    }
}

function changeAnimation() {
    changeDieState(die1, Math.floor(Math.random() * 6) + 1)
    changeDieState(die2, Math.floor(Math.random() * 6) + 1)
    const shakeStrength = 10
    let die1pixelsx = (Math.random() - .5) * shakeStrength
    let die1pixelsy = (Math.random() - .5) * shakeStrength
    let die2pixelsx = (Math.random() - .5) * shakeStrength
    let die2pixelsy = (Math.random() - .5) * shakeStrength

    document.getElementById("keyframe-style").innerHTML = '@keyframes shake-die1 {100% {transform: translate(' + Math.round(die1pixelsx * 100) / 100 + 'px, ' + Math.round(die1pixelsy * 100) / 100 + 'px);}}\n@keyframes shake-die2 {100% {transform: translate(' + Math.round(die2pixelsx * 100) / 100 + 'px, ' + Math.round(die2pixelsy * 100) / 100 + 'px);}}'

    console.log(die1pixelsx, die1pixelsy, die2pixelsx, die2pixelsy)
}

function changeDieState(die, state) {
    const pipClasses = ["one", "two", "three", "four", "five", "six"]
    let pips = die.querySelectorAll(".pip")
    console.log(pips)
    for (let j = 0; j < pips.length; j++) {
        pips[j].setAttribute("fill", "#FFF1DC")
    }
    let numPips = die.querySelectorAll("." + pipClasses[state - 1])
    console.log(numPips)
    for (let j = 0; j < numPips.length; j++) {
        numPips[j].setAttribute("fill", "#1F1F1F")
    }
}