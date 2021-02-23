'use strict'

console.log('gy')

let today
let formatDate
let selectElement

function updateTime () {
  today = new Date()
  formatDate = dateDiffFormatted(today, Date('9/10/21'))
  selectElement = document.getElementById('date')
  selectElement.innerHTML = formatDate
}

function dateDiffFormatted (a, b) {
  const utc1 = Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate(), a.getUTCHours(), a.getUTCMinutes(), a.getUTCSeconds())
  const utc2 = Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate(), b.getUTCHours(), b.getUTCMinutes(), b.getUTCSeconds())

  return String(Math.floor((utc2 - utc1) / 1000 * 60 * 60 * 24)) + ':' +
        String(Math.floor((utc2 - utc1) / 1000 * 60 * 60)) + ':' +
        String(Math.floor((utc2 - utc1) / 1000 * 60)) + ':' +
        String(Math.floor((utc2 - utc1) / 1000)) + ':' +
        String(utc2 - utc1)
}

setInterval(updateTime, 1)
