let vw = window.innerWidth
let vh = window.innerHeight
let mainText
const asciiGrayscale = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'.'

function updateScreenSize () {
  vw = window.innerWidth
  vh = window.innerHeight
}

function updateScreen () {
  updateScreenSize()
  mainText = document.getElementById('main-text')
  const charWidth = Math.floor(vw / 13.90)
  const charHeight = Math.floor(vh / 30.5)
  console.log(vw.toString(), vh.toString(), charWidth.toString(), charHeight.toString())
  let text = ''
  for (let i = 0; i < charHeight; i++) {
    for (let j = 0; j < charWidth; j++) {
      text += asciiGrayscale[Math.floor(Math.random() * asciiGrayscale.length)]
    }
    text += '\n'
  }
  mainText.innerHTML = text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

updateScreen()
setInterval(updateScreen, 10)
