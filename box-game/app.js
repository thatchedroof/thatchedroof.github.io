'use strict'

console.log('gy')

let today
let theDay
let formatDate
let selectElement

Matter.use('matter-wrap')

function updateTime () {
  today = new Date()
  theDay = new Date('9/10/21')
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

// module aliases
const Engine = Matter.Engine
const Render = Matter.Render
const World = Matter.World
const Bodies = Matter.Bodies

const canvas = document.getElementById('matterJS')

canvas.style.position = 'fixed'

// create an engine
const engine = Engine.create({
  element: document.body,
  canvas: canvas
})

const width = window.innerWidth
const height = window.innerHeight

// create a renderer
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: width,
    height: height,
    background: 'transparent',
    wireframes: false
  }
})

// create two boxes and a ground
// const boxA = Bodies.rectangle(400, 200, 80, 80, { render: { fillStyle: 'crimson' }, plugin: { wrap: { min: { x: 0, y: 0 }, max: { x: width, y: height } } } })
// const boxB = Bodies.rectangle(450, 50, 80, 80, { render: { fillStyle: 'royalblue' }, plugin: { wrap: { min: { x: 0, y: 0 }, max: { x: width, y: height } } } })

function toMidCoords (x, y, wsize, hsize) {
  return [x + wsize / 2, y + hsize / 2, wsize, hsize]
}

function betterStack (vw, vh, size, columns, rows, color1, color2) {
  let whichColor = true
  const startingX = width * vw
  const startingY = height - (size * width) - (height * vh)
  return Matter.Composites.stack(startingX, startingY, columns, rows, 0, 0, function (x, y) {
    whichColor = !whichColor
    if (whichColor) {
      return Bodies.rectangle(x, y, (size * width) / columns, (size * width) / rows, {
        render: { fillStyle: color1 },
        plugin: { wrap: { min: { x: 0, y: 0 }, max: { x: width, y: height } } }
      })
    } else {
      return Bodies.rectangle(x, y, (size * width) / columns, (size * width) / rows, {
        render: { fillStyle: color2 },
        plugin: { wrap: { min: { x: 0, y: 0 }, max: { x: width, y: height } } }
      })
    }
  })
}

function betterRectangle (vw, vh, wsize, hsize, color) {
  const startingX = width * vw
  const startingY = height * vh
  console.log(width, height, startingX, startingY)
  return Bodies.rectangle(...toMidCoords(startingX, startingY, wsize * width, hsize * height), { render: { fillStyle: color }, plugin: { wrap: { min: { x: 0, y: 0 }, max: { x: width, y: height } } } })
}

function betterSquare (vw, vh, size, color) {
  const startingX = (2 * width * vw + size * width) / 2
  const startingY = ((2 * height - (size * width)) / 2) - (height * vh)
  console.log(width, height, startingX, startingY)
  return Bodies.rectangle(startingX, startingY, size * width, size * width, { render: { fillStyle: color }, plugin: { wrap: { min: { x: 0, y: 0 }, max: { x: width, y: height } } } })
}

const boxA = betterSquare(1 / 10, 1 / 10, 1 / 10, 'crimson')
const boxB = betterSquare(1 / 10, 2 / 10, 1 / 10, 'royalblue')
const rectA = betterRectangle(1 / 10, 3 / 10, 3 / 10, 1 / 30, 'greenyellow')

console.log(boxA)

const stack = betterStack(7 / 10 - 0.001, 0, 3 / 10, 9, 9, 'crimson', 'royalblue')

const mouse = Matter.Mouse.create(render.canvas)
const mouseConstraint = Matter.MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    render: { visible: false },
    angularStiffness: 0,
    stiffness: 0.9
  }
})

render.mouse = mouse

mouseConstraint.mouse.element.removeEventListener('mousewheel', mouseConstraint.mouse.mousewheel)
mouseConstraint.mouse.element.removeEventListener('DOMMouseScroll', mouseConstraint.mouse.mousewheel)

const borderSize = 200

const xOrigin = 0
const yOrigin = 0

World.add(engine.world, [
  boxA, boxB, rectA, stack,
  // top
  Bodies.rectangle(xOrigin + width / 2, yOrigin + -borderSize / 2, 2 * borderSize + width, borderSize - 1, {
    isStatic: true,
    render: { fillStyle: 'white' }
  }),
  // right
  Bodies.rectangle(xOrigin + width + borderSize / 2, yOrigin + height / 2, borderSize, 2 * borderSize + height, {
    isStatic: true,
    render: { fillStyle: 'white' }
  }),
  // bottom
  Bodies.rectangle(xOrigin + width / 2, yOrigin + height + borderSize / 2, 2 * borderSize + width, borderSize + 1, {
    isStatic: true,
    render: { fillStyle: 'white' }
  }),
  // left
  Bodies.rectangle(xOrigin - borderSize / 2, yOrigin + height / 2, borderSize, 2 * borderSize + height, {
    isStatic: true,
    render: { fillStyle: 'white' }
  }),
  mouseConstraint
])

// run the engine
Engine.run(engine)

// run the renderer
Render.run(render)

console.log('gy')
