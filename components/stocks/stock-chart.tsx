"use client"

import { useEffect, useRef } from "react"

interface StockChartProps {
  type: "line" | "candlestick"
}

export function StockChart({ type }: StockChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const parent = canvas.parentElement
      if (!parent) return

      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
    }

    try {
      setCanvasDimensions()
      window.addEventListener("resize", setCanvasDimensions)

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw chart based on type
      if (type === "line") {
        drawLineChart(ctx, canvas.width, canvas.height)
      } else {
        drawCandlestickChart(ctx, canvas.width, canvas.height)
      }
    } catch (error) {
      console.error("Error rendering chart:", error)
    }

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [type])

  const drawLineChart = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!width || !height) return

    // Generate random data for demonstration
    const dataPoints = 100
    const data: number[] = []
    for (let i = 0; i < dataPoints; i++) {
      const randomValue = Math.random() * 0.1
      data[i] = i === 0 ? 100 : data[i - 1] * (1 + (Math.random() > 0.5 ? randomValue : -randomValue))
    }

    // Find min and max values for scaling
    const minValue = Math.min(...data) * 0.95
    const maxValue = Math.max(...data) * 1.05
    const valueRange = maxValue - minValue

    // Draw grid
    drawGrid(ctx, width, height)

    // Draw line
    ctx.beginPath()
    ctx.strokeStyle = "hsl(var(--primary))"
    ctx.lineWidth = 2

    data.forEach((value, index) => {
      const x = (index / (dataPoints - 1)) * width
      const y = height - ((value - minValue) / valueRange) * (height * 0.8) - height * 0.1

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw area under the line
    ctx.lineTo(width, height)
    ctx.lineTo(0, height)
    ctx.closePath()
    ctx.fillStyle = "hsla(var(--primary), 0.1)"
    ctx.fill()

    // Draw labels
    drawLabels(ctx, width, height, minValue, maxValue)
  }

  const drawCandlestickChart = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!width || !height) return

    // Generate random data for demonstration
    const dataPoints = 30
    const data = Array.from({ length: dataPoints }, () => {
      const baseValue = 100 + Math.random() * 50
      const range = baseValue * 0.05
      const open = baseValue - range / 2 + Math.random() * range
      const close = baseValue - range / 2 + Math.random() * range
      const high = Math.max(open, close) + Math.random() * range * 0.5
      const low = Math.min(open, close) - Math.random() * range * 0.5

      return { open, close, high, low }
    })

    // Find min and max values for scaling
    const allValues = data.flatMap((d) => [d.open, d.close, d.high, d.low])
    const minValue = Math.min(...allValues) * 0.95
    const maxValue = Math.max(...allValues) * 1.05
    const valueRange = maxValue - minValue

    // Draw grid
    drawGrid(ctx, width, height)

    // Draw candlesticks
    const candleWidth = (width / dataPoints) * 0.8

    data.forEach((candle, index) => {
      const x = (index / (dataPoints - 1)) * width
      const centerX = x

      const openY = height - ((candle.open - minValue) / valueRange) * (height * 0.8) - height * 0.1
      const closeY = height - ((candle.close - minValue) / valueRange) * (height * 0.8) - height * 0.1
      const highY = height - ((candle.high - minValue) / valueRange) * (height * 0.8) - height * 0.1
      const lowY = height - ((candle.low - minValue) / valueRange) * (height * 0.8) - height * 0.1

      // Draw wick
      ctx.beginPath()
      ctx.strokeStyle = "hsl(var(--foreground))"
      ctx.lineWidth = 1
      ctx.moveTo(centerX, highY)
      ctx.lineTo(centerX, lowY)
      ctx.stroke()

      // Draw body
      const isGreen = candle.close > candle.open
      ctx.fillStyle = isGreen ? "hsl(var(--success))" : "hsl(var(--destructive))"

      const bodyTop = isGreen ? closeY : openY
      const bodyHeight = Math.abs(closeY - openY)

      ctx.fillRect(centerX - candleWidth / 2, bodyTop, candleWidth, bodyHeight)
    })

    // Draw labels
    drawLabels(ctx, width, height, minValue, maxValue)
  }

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = "hsl(var(--border))"
    ctx.lineWidth = 1

    // Horizontal grid lines
    const horizontalLines = 5
    for (let i = 0; i <= horizontalLines; i++) {
      const y = (i / horizontalLines) * height

      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Vertical grid lines
    const verticalLines = 10
    for (let i = 0; i <= verticalLines; i++) {
      const x = (i / verticalLines) * width

      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
  }

  const drawLabels = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    minValue: number,
    maxValue: number,
  ) => {
    ctx.fillStyle = "hsl(var(--muted-foreground))"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "left"

    // Y-axis labels
    const horizontalLines = 5
    for (let i = 0; i <= horizontalLines; i++) {
      const y = (i / horizontalLines) * height
      const value = maxValue - (i / horizontalLines) * (maxValue - minValue)

      ctx.fillText(value.toFixed(2), 5, y + 4)
    }

    // X-axis labels (dates)
    const verticalLines = 10
    const now = new Date()

    for (let i = 0; i <= verticalLines; i++) {
      const x = (i / verticalLines) * width
      const daysAgo = Math.floor((verticalLines - i) * 3)
      const date = new Date(now)
      date.setDate(date.getDate() - daysAgo)

      const label = `${date.getMonth() + 1}/${date.getDate()}`
      ctx.textAlign = "center"
      ctx.fillText(label, x, height - 5)
    }
  }

  return (
    <div className="w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
    </div>
  )
}

