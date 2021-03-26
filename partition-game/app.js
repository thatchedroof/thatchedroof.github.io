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
reroll()
buttonUpdate()

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

function reroll() {
    r1 = Math.floor(Math.random() * 6) + 1
    r2 = Math.floor(Math.random() * 6) + 1
    roll = r1 + r2
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
