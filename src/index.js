import arcList from './resource/arcList'

class CanvasMap {

  constructor(circleList = [], circleRadius = 0) {
    this.circleList = circleList
    this.circleRadius = circleRadius
    this.start = {
      x: null,
      y: null,
      currentCircleIndex: -1,
      currentElementX: null,
      currentElementY: null,
      setPosition(currentElement) {
        this.currentElementY = currentElement && currentElement.y
        this.currentElementX = currentElement && currentElement.x
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

  filterCircles(list) {
    const { ctxWidth, ctxHeight } = this.getMap()
    return list.filter(({ x, y }) => {
      return !(
        (x + this.circleRadius) > ctxWidth ||
        (y + this.circleRadius) > ctxHeight ||
        y < this.circleRadius ||
        x < this.circleRadius
      )
    })
  }

  setCircles() {
    const { ctx, ctxHeight, ctxWidth } = this.getMap()
    ctx.clearRect(0, 0, ctxWidth, ctxHeight)
    const pi = Math.PI
    this.circleList = this.filterCircles(this.circleList)
    this.circleList.forEach(({ x, y }) => {
      ctx.beginPath()
      ctx.fillStyle = '#000'
      ctx.arc(x, y, this.circleRadius, 0, pi * 2, false)
      ctx.fill()
      ctx.closePath()
    })
  }

  moveCircle = ({ x, y }) => {
    if (!this.start.x || !this.start.y) {
      this.start.x = x
      this.start.y = y
      if (!this.start.currentElementY || !this.start.currentElementX) this.start.setPosition(this.circleList[ this.currentCircleIndex ])
    }
    x = x - this.start.x + this.start.currentElementX
    y = y - this.start.y + this.start.currentElementY
    if (this.filterCircles([ { x, y } ]).length) {
      this.circleList[ this.currentCircleIndex ] = { x, y }
      this.setCircles()
    }
  }

  setDefaultStart = () => {
    this.start.x = null
    this.start.y = null
    this.start.setPosition()
    canvas.removeEventListener('mousemove', this.moveCircle)
    document.body.removeEventListener('mouseup', this.setDefaultStart)
  }

  cursorInCircle = (x, y) => this.circleList.findIndex((item) => {
    return (item.x + this.circleRadius >= x && item.x - this.circleRadius <= x) &&
      (item.y + this.circleRadius >= y && item.y - this.circleRadius <= y)
  })

  onMouseDown = ({ currentTarget, x, y }) => {
    this.currentCircleIndex = this.cursorInCircle(x, y)

    if (this.currentCircleIndex >= 0) {
      currentTarget.addEventListener('mousemove', this.moveCircle)
      document.body.addEventListener('mouseup', this.setDefaultStart)
    }
  }
}

const simpleCanvasMap = new CanvasMap(arcList, 5)

simpleCanvasMap.setCircles()

const { canvas } = simpleCanvasMap.getMap()

canvas.addEventListener('mousedown', simpleCanvasMap.onMouseDown)
