import { Helmet } from 'react-helmet'
import { Hero } from 'src/components/hero'
import * as Matter from 'matter-js'
import { useEffect, useRef, useState } from 'react'

export default function Home() {
  let canvas = useRef<HTMLCanvasElement | null>(null)
  const [box, setBox] = useState({ x: 0, y: 0, angle: 0, width: 0, height: 0 })

  useEffect(() => {
    let Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Body = Matter.Body,
      Composite = Matter.Composite,
      Composites = Matter.Composites,
      Constraint = Matter.Constraint,
      MouseConstraint = Matter.MouseConstraint,
      Mouse = Matter.Mouse,
      Bodies = Matter.Bodies

    // create engine
    let engine = Engine.create(),
      world = engine.world

    let debug = false

    if (debug) {
      // create renderer
      let render = Render.create({
        element: document.getElementById('matterjs')!,
        engine: engine,
        options: {
          width: window.innerWidth,
          height: window.innerHeight,
          wireframes: debug,
          background: 'transparent',
          wireframeBackground: 'transparent',
          showAngleIndicator: true,
          showCollisions: true,
          showVelocity: true,
        },
      })

      Render.run(render)

      canvas.current = render.canvas
    } else if (canvas.current) {
      const ctx = canvas.current.getContext('2d')!
      canvas.current.width = window.innerWidth
      canvas.current.height = window.innerHeight

      function renderCustom() {
        ctx.clearRect(0, 0, canvas.current!.width, canvas.current!.height)

        const constraints = Composite.allConstraints(engine.world)

        for (let constraint of constraints) {
          if (constraint.render.strokeStyle === '#B39863') {
            ctx.beginPath()
            try {
              let pointA
              let pointB

              if ((constraint.render as any).asBody) {
                pointA = constraint.bodyA?.position ?? constraint.pointA
              } else if (constraint.bodyA?.position) {
                let { x: x1, y: y1 } = constraint.bodyA.position
                let { x: x2, y: y2 } = constraint.pointA
                pointA = { x: x1 + x2, y: y1 + y2 }
              } else {
                pointA = constraint.pointA
              }

              if ((constraint.render as any).asBody) {
                pointB = constraint.bodyB?.position ?? constraint.pointB
              } else if (constraint.bodyB?.position) {
                let { x: x1, y: y1 } = constraint.bodyB.position
                let { x: x2, y: y2 } = constraint.pointB
                pointB = { x: x1 + x2, y: y1 + y2 }
              } else {
                pointB = constraint.pointB
              }

              ctx.moveTo(pointA.x, pointA.y)
              ctx.lineTo(pointB.x, pointB.y)
            } catch (e) {
              // Handle the error or ignore it
            }
            ctx.strokeStyle = constraint.render.strokeStyle ?? '#999'
            ctx.lineWidth = constraint.render.lineWidth ?? 2
            ctx.stroke()
          }
        }

        const bodies = Composite.allBodies(engine.world)

        for (let body of bodies.toReversed()) {
          const vertices = body.vertices

          if ((body.render as any).shadow) {
            ctx.shadowColor = 'rgba(0,0,0,0.2)'
            ctx.shadowBlur = 10
            ctx.shadowOffsetX = 5
            ctx.shadowOffsetY = 5
          }

          ctx.beginPath()
          ctx.moveTo(vertices[0].x, vertices[0].y)
          for (let j = 1; j < vertices.length; j++) {
            ctx.lineTo(vertices[j].x, vertices[j].y)
          }
          ctx.closePath()

          // Fill
          if (body.render.fillStyle) {
            ctx.fillStyle = body.render.fillStyle
            ctx.fill()
          } else {
            ctx.fillStyle = '#bbb'
            ctx.fill()
          }

          // Stroke
          if ((body.render as any).stroke) {
            ctx.strokeStyle = (body.render as any).stroke
            ctx.lineWidth = body.render.lineWidth ?? 1
            ctx.stroke()
          }

          if ((body.render as any).text) {
            ctx.save()
            ctx.translate(body.position.x, body.position.y)
            ctx.rotate(body.angle)
            ctx.fillStyle = (body.render as any).stroke || '#000'
            ctx.font = '20px Arial'
            ctx.textAlign = 'center'
            ctx.fillText((body.render as any).text, 0, 0)
            ctx.restore()
          }

          if ((body.render as any).isBox) {
            setBox({
              x: body.position.x,
              y: body.position.y,
              angle: body.angle,
              width: (body.render as any).width,
              height: (body.render as any).height,
            })
          }

          ctx.shadowColor = 'transparent'
          ctx.shadowBlur = 0
          ctx.shadowOffsetX = 0
          ctx.shadowOffsetY = 0
        }
      }

      const TIME_STEP = 1000 / 60
      let steps = 0

      ;(function run(time?: number) {
        Matter.Engine.update(engine, TIME_STEP)
        renderCustom()
        steps += 1
        window.requestAnimationFrame(run)
      })()
    } else {
      throw new Error('Canvas not initialized')
    }

    let runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)

    let group = Matter.Body.nextGroup(true)

    function createRope(x: number, y: number, numSegments: number, segmentLength: number, ropeWidth: number) {
      return Matter.Composites.stack(
        x,
        y,
        1,
        numSegments,
        10,
        10,
        function (x: number, y: number, r: number, c: number) {
          let color1 = '#B39863'
          let color2 = '#B39863'

          let color = c % 2 === 0 ? color1 : color2

          return Matter.Bodies.rectangle(x, y, segmentLength, ropeWidth, {
            collisionFilter: { group: group },
            // @ts-ignore
            chamfer: 5,
            density: 0.003,
            frictionAir: 0.01,
            render: { fillStyle: color },
          })
        },
      )
    }

    let n = 15

    let signWidth = 400
    let signHeight = 200
    let signX = canvas.current.width / 2
    let signY = canvas.current.height / 2
    let ropeY = -40
    let ropeLength = 40
    let ropeWidth = 15
    let ropeOffset = 30

    let ropeLeftX = -signWidth / 2 + ropeOffset + signX
    let ropeRightX = signWidth / 2 - ropeOffset + signX

    let leftRope = createRope(ropeLeftX, ropeY, n, ropeLength, ropeWidth)
    let rightRope = createRope(ropeRightX, ropeY, n, ropeLength, ropeWidth)

    let weight = Matter.Bodies.rectangle(signX, signY, signWidth, signHeight, {
      collisionFilter: { group: group },
      //   density: 0.02,
      frictionAir: 0.00001,
      render: {
        fillStyle: 'tan',
        stroke: 'brown',
        text: 'WELCOME',
        isBox: true,
        width: signWidth,
        height: signHeight,
        shadow: true,
      } as any,
    })
    Matter.Body.applyForce(weight, weight.position, { x: -0.5, y: 0 })

    // Add the weight and both rope composites to the world
    Matter.Composite.add(world, [weight, leftRope, rightRope])

    const breakThreshold = 30

    function monitorConstraintBreaking(constraints: Matter.Constraint[]) {
      Matter.Events.on(engine, 'afterUpdate', () => {
        constraints.forEach((constraint, index) => {
          if (!constraint || !constraint.bodyA || !constraint.bodyB) return

          const a = constraint.bodyA.position
          const b = constraint.bodyB.position
          const dx = b.x - a.x
          const dy = b.y - a.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance > breakThreshold) {
            // Matter.Composite.remove(world, constraint)
            // Optional: remove from the array so we don't check it again
            // constraints[index] = null;
            // console.log('Constraint broke:', constraint)
          }
        })
      })
    }

    let chainDistance = 0.3

    let leftChain = Matter.Composites.chain(leftRope, chainDistance, 0, -chainDistance, 0, {
      stiffness: 0.99,
      length: 0.0001,
      render: {
        visible: true,
        lineWidth: ropeWidth,
        strokeStyle: '#B39863',
        asBody: true,
      },
    })
    let rightChain = Matter.Composites.chain(rightRope, chainDistance, 0, -chainDistance, 0, {
      stiffness: 0.99,
      length: 0.0001,
      render: {
        visible: true,
        lineWidth: ropeWidth,
        strokeStyle: '#B39863',
        asBody: true,
      },
    })

    monitorConstraintBreaking(leftChain.constraints)
    monitorConstraintBreaking(rightChain.constraints)

    Matter.Composite.add(
      world,
      Matter.Constraint.create({
        bodyA: leftRope.bodies[leftRope.bodies.length - 1],
        pointA: { x: 0, y: 0 },
        bodyB: weight,
        pointB: { x: ropeLeftX - signX, y: 0 },
        length: 1,
        stiffness: 0.5,
        render: {
          visible: true,
          lineWidth: ropeWidth,
          strokeStyle: '#B39863',
        },
      }),
    )

    Matter.Composite.add(
      world,
      Matter.Constraint.create({
        bodyA: rightRope.bodies[rightRope.bodies.length - 1],
        pointA: { x: 0, y: 0 },
        bodyB: weight,
        pointB: { x: ropeRightX - signX, y: 0 },
        length: 1,
        stiffness: 0.5,
        render: {
          visible: true,
          lineWidth: ropeWidth,
          strokeStyle: '#B39863',
        },
      }),
    )

    Matter.Composite.add(
      world,
      Matter.Constraint.create({
        pointA: {
          x: leftRope.bodies[0].position.x,
          y: leftRope.bodies[0].position.y,
        },
        bodyB: leftRope.bodies[0],
        pointB: { x: -20, y: 0 },
        stiffness: 0.9,

        render: {
          visible: true,
          lineWidth: ropeWidth,
          strokeStyle: '#B39863',
          asBody: true,
        } as any,
      }),
    )

    Matter.Composite.add(
      world,
      Matter.Constraint.create({
        pointA: {
          x: rightRope.bodies[0].position.x,
          y: rightRope.bodies[0].position.y,
        },
        bodyB: rightRope.bodies[0],
        pointB: { x: -20, y: 0 },
        stiffness: 0.9,

        render: {
          visible: true,
          lineWidth: ropeWidth,
          strokeStyle: '#B39863',
          asBody: true,
        } as any,
      }),
    )

    let mouse = Matter.Mouse.create(canvas.current)
    let mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        pointB: mouse.position,
        render: {
          visible: false,
        },
      },
    })

    Matter.Composite.add(world, mouseConstraint)

    // Event.on(mouseConstraint, "startdrag", function (event) {
    //   const body = event.body;
    //   const mousePos = mouse.position;

    //   if (body) {
    //     const offset = {
    //       x: mousePos.x - body.position.x,
    //       y: mousePos.y - body.position.y,
    //     };
    //     mouseConstraint.constraint.pointB = offset;
    //   }
    // });

    // mouse.element.removeEventListener('wheel', mouse.mousewheel)
    // mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel)
  }, [])

  return (
    <>
      <Helmet>
        <title>Thatchedroof's World</title>
      </Helmet>
      <canvas id="matterjs" style={{ resize: 'none' }} ref={canvas}></canvas>
      {/* <div
        style={{
          position: 'absolute',
          left: box.x - box.width / 2,
          top: box.y - box.height / 2,
          width: box.width,
          height: box.height,
          backgroundColor: '#4A90E2',
          color: 'white',
          fontWeight: 'bold',
          textAlign: 'center',
          lineHeight: '60px',
          transform: `rotate(${box.angle}rad)`,
          transformOrigin: 'center',
          borderRadius: '8px',
          pointerEvents: 'none',
        }}
      >
        Hello Matter.js
      </div> */}
      <h1 className="scroll-m-20 text-4xl font-bold lg:text-5xl m-5">
        thatchedroofsworld . <br />. <br />. <br />. <br />. <br />. <br />. <br />.
        <br />. <br />. <br />. <br />. <br />. <br />. <br />. <br />. <br />.
        <br />. <br />. <br />. <br />. <br />. <br />. <br />. <br />. <br />.
        <br />. <br />
      </h1>
    </>
  )
}
