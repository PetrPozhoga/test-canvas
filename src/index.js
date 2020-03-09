import arcList from './resource/arcList'

class CanvasMap {
  constructor(dotList = [], circleRadius = 0) {
    this.dotList = dotList
    this.circleRadius = circleRadius
    this.start = {
      x: null,
      y: null,
      left: null,
      top: null,
      setPosition(canvas) {
        this.top = Number(getComputedStyle(canvas).top.replace('px', '')) || 0
        this.left = Number(getComputedStyle(canvas).left.replace('px', '')) || 0
      }
    }
  }

  getMap = () => {
    const canvas = document.getElementById('canvas')
    const ctxWidth = canvas.getAttribute('width')
    const ctxHeight = canvas.getAttribute('height')
    const ctx = canvas.getContext('2d')
    return { ctx, ctxWidth, ctxHeight, canvas }
  }

  setDots() {
    const { ctxWidth, ctxHeight, ctx } = this.getMap()
    const pi = Math.PI
    this.dotList.forEach(({ x, y }) => {
      if ((x + this.circleRadius) > ctxWidth ||
        (y + this.circleRadius) > ctxHeight ||
        y < this.circleRadius ||
        x < this.circleRadius) return
      else {
        ctx.beginPath()
        ctx.fillStyle = '#000'
        ctx.arc(x, y, this.circleRadius, 0, pi * 2, false)
        ctx.fill()
      }
    })
  }

  moveMap = ({ x, y }) => {
    const { canvas } = this.getMap()

    if (!this.start.x || !this.start.y) {
      this.start.x = x
      this.start.y = y
      if (!this.start.top || !this.start.left) this.start.setPosition(canvas)
    }

    canvas.style.left = x - this.start.x + this.start.left + 'px'
    canvas.style.top = y - this.start.y + this.start.top + 'px'
  }

  setDefaultStart = () => {
    this.start.x = null
    this.start.y = null
    this.start.setPosition(canvas)
    document.body.removeEventListener('mousemove', this.moveMap)
    document.body.removeEventListener('mouseup', this.setDefaultStart)
  }

  onMouseDown = () => {
    document.body.addEventListener('mousemove', this.moveMap)
    document.body.addEventListener('mouseup', this.setDefaultStart)
  }
}

const simpleCanvasMap = new CanvasMap(arcList, 5)

simpleCanvasMap.setDots()

const { canvas } = simpleCanvasMap.getMap()

canvas.addEventListener('mousedown', simpleCanvasMap.onMouseDown)
