import { useId } from 'react'

export function CurveSeparator() {
  const gid = useId()

  return (
    <svg
      width="100%"
      height="60"
      viewBox="0 0 600 80"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#667eea" stopOpacity="1" />
          <stop offset="50%" stopColor="#764ba2" stopOpacity="1" />
          <stop offset="100%" stopColor="#f093fb" stopOpacity="1" />
        </linearGradient>
      </defs>

      <path
        d="M 0 60 Q 300 10, 600 60"
        stroke={`url(#${gid})`}
        strokeWidth="3"
        fill="none"
      />
    </svg>
  )
}
