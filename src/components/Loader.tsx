'use client'
import { useState, useEffect } from 'react'

type DotPattern = [number, number][]

export default function GlobalLoader() {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => ({
        x: prev.x + 1,
        y: prev.y + 2,
      }))
    }, 16)

    return () => clearInterval(interval)
  }, [])

  const dotPatterns: Record<number, DotPattern> = {
    1: [[1, 1]],
    2: [
      [0, 0],
      [2, 2],
    ],
    3: [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    4: [
      [0, 0],
      [0, 2],
      [2, 0],
      [2, 2],
    ],
    5: [
      [0, 0],
      [0, 2],
      [1, 1],
      [2, 0],
      [2, 2],
    ],
    6: [
      [0, 0],
      [0, 1],
      [0, 2],
      [2, 0],
      [2, 1],
      [2, 2],
    ],
  }

  const renderDots = (number: number) => {
    const dots = dotPatterns[number]
    return (
      <div className="grid grid-cols-3 gap-2 p-4 w-full h-full">
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => {
            const hasDot = dots.some(([r, c]) => r === row && c === col)
            return (
              <div
                key={`${row}-${col}`}
                className={`w-3 h-3 rounded-full ${
                  hasDot ? 'bg-gray-900' : ''
                }`}
              />
            )
          })
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="perspective-1000">
        <div
          className="w-24 h-24 relative"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
        >
          {/* Front face - 1 */}
          <div
            className="absolute w-24 h-24 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center"
            style={{ transform: 'translateZ(48px)' }}
          >
            {renderDots(1)}
          </div>

          {/* Back face - 6 */}
          <div
            className="absolute w-24 h-24 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center"
            style={{ transform: 'translateZ(-48px) rotateY(180deg)' }}
          >
            {renderDots(6)}
          </div>

          {/* Right face - 2 */}
          <div
            className="absolute w-24 h-24 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center"
            style={{ transform: 'rotateY(90deg) translateZ(48px)' }}
          >
            {renderDots(2)}
          </div>

          {/* Left face - 5 */}
          <div
            className="absolute w-24 h-24 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center"
            style={{ transform: 'rotateY(-90deg) translateZ(48px)' }}
          >
            {renderDots(5)}
          </div>

          {/* Top face - 3 */}
          <div
            className="absolute w-24 h-24 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center"
            style={{ transform: 'rotateX(90deg) translateZ(48px)' }}
          >
            {renderDots(3)}
          </div>

          {/* Bottom face - 4 */}
          <div
            className="absolute w-24 h-24 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center"
            style={{ transform: 'rotateX(-90deg) translateZ(48px)' }}
          >
            {renderDots(4)}
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  )
}
