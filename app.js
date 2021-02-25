'use strict'

console.log('gy')

let today
let theDay
let formatDate
let selectElement

function updateTime () {
  today = new Date()
  theDay = new Date('2021-08-11T14:26:00Z')
  formatDate = dateDiffFormatted(today, theDay)
  selectElement = document.getElementById('date')
  selectElement.innerHTML = formatDate
}

function dateDiffFormatted (a, b) {
  const utc1 = Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate(), a.getUTCHours(), a.getUTCMinutes(), a.getUTCSeconds(), a.getUTCMilliseconds())
  const utc2 = Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate(), b.getUTCHours(), b.getUTCMinutes(), b.getUTCSeconds(), b.getUTCMilliseconds())

  const days = Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24))
  const hours = Math.floor((utc2 - utc1) / (1000 * 60 * 60))
  const minutes = Math.floor((utc2 - utc1) / (1000 * 60))
  const seconds = Math.floor((utc2 - utc1) / 1000)
  const milliseconds = utc2 - utc1
  return String(days) + ':' +
        String(hours % 24).padStart(2, '0') + ':' +
        String(minutes % 60).padStart(2, '0') + ':' +
        String(seconds % 60).padStart(2, '0') + ':' +
        String(milliseconds % 1000).padStart(3, '0')
}

function topFunction () {
  document.body.scrollTop = 0 // For Safari
  document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
}

setInterval(updateTime, 1)
