import { useEffect, useRef } from 'react'

import { animate, useInView, useReducedMotion } from 'motion/react'

// `value` is a display string with one number in it, e.g. '$10M+', '87%' or '60'
type CountUpProps = {
  value: string
  className?: string
}

const DURATION_SECONDS = 1.4

const CountUp = ({ value, className }: CountUpProps) => {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.6 })
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const element = ref.current
    const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/)

    if (!element || !match || shouldReduceMotion) return

    const [, prefix, number, suffix] = match
    const decimals = number.split('.')[1]?.length ?? 0
    const format = (current: number) => `${prefix}${current.toFixed(decimals)}${suffix}`

    // The server renders the final value; start from zero once hydrated and count up when seen
    if (!isInView) {
      element.textContent = format(0)

      return
    }

    const controls = animate(0, Number(number), {
      duration: DURATION_SECONDS,
      ease: 'easeOut',
      onUpdate: current => {
        element.textContent = format(current)
      }
    })

    return () => controls.stop()
  }, [isInView, shouldReduceMotion, value])

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  )
}

export default CountUp
