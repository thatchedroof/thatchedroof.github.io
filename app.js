'use strict'

console.log('gy')

let today
let formatDate
let selectElement

function updateTime () {
  today = new Date()
  formatDate = today.toDateString() + today.toTimeString() + today.toISOString()
  selectElement = document.getElementById('date')
  selectElement.innerHTML = formatDate
}

setInterval(updateTime, 1)
