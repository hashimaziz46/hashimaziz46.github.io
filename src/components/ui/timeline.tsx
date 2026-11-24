import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import {
  type MotionValue,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform
} from 'motion/react'

import { cn } from '@/lib/utils'

export type TimelineEntry = {
  index: string
  content: ReactNode
}

// How much higher the content sits compared to its number, in pixels
const CONTENT_LIFT = 12

type TimelineRowProps = TimelineEntry & {
  isLast: boolean
  rowRef: (node: HTMLDivElement | null) => void
  indexRef: (node: HTMLDivElement | null) => void
}

const TimelineRow = ({ index, content, isLast, rowRef, indexRef }: TimelineRowProps) => {
  const localRowRef = useRef<HTMLDivElement>(null)
  const [reached, setReached] = useState(false)

  const { scrollYProgress } = useScroll({
    target: localRowRef,
    offset: ['start 70%', 'start 45%']
  })

  // Light the number up once the row has fully arrived, and dim it again when scrolling back
  useMotionValueEvent(scrollYProgress, 'change', value => setReached(value >= 1))

  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.5 })
  const opacity = useTransform(progress, [0, 1], [0, 1])
  const y = useTransform(progress, [0, 1], [64, 0])
  const contentY = useTransform(progress, [0, 1], [64 - CONTENT_LIFT, -CONTENT_LIFT])

  return (
    <div
      ref={node => {
        localRowRef.current = node
        rowRef(node)
      }}
      className={cn('relative', !isLast && 'pb-16 sm:pb-32')}
    >
      <motion.div
        ref={indexRef}
        style={{ opacity, y }}
        className={cn(
          'text-muted-foreground absolute left-8 w-fit -translate-x-1/2 px-1 text-center text-lg italic transition-colors duration-500 sm:left-14 sm:text-[22px]',
          reached && 'text-accent font-medium'
        )}
      >
        {index}
      </motion.div>
      <motion.div style={{ opacity, y: contentY }} className='min-w-0 pl-16 sm:pl-39'>
        {content}
      </motion.div>
    </div>
  )
}

type Segment = { start: number; end: number }

const TimelineSegment = ({ start, end, revealed }: { start: number; end: number; revealed: MotionValue<number> }) => {
  const height = useTransform(revealed, value => Math.min(Math.max(value - start, 0), end - start))

  return (
    <div style={{ top: start, height: end - start }} className='absolute left-8 w-0.5 overflow-hidden sm:left-14'>
      <motion.div style={{ height }} className='bg-accent absolute inset-x-0 top-0 w-0.5 rounded-full' />
    </div>
  )
}

const LINE_GAP = 32

// Sparks thrown off the head of the line while it moves
type Spark = { id: number; top: number; x: number; y: number; size: number; warm: boolean }

const SPARK_INTERVAL_MS = 32
const SPARKS_PER_BURST = 2
const MAX_SPARKS = 28

const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const rowNodes = useRef<Array<HTMLDivElement | null>>([])
  const indexNodes = useRef<Array<HTMLDivElement | null>>([])
  const [segments, setSegments] = useState<Segment[]>([])
  const [sparks, setSparks] = useState<Spark[]>([])
  const sparkId = useRef(0)
  const lastSparkAt = useRef(0)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (!contentRef.current) return

    const measure = () => {
      const containerTop = contentRef.current!.getBoundingClientRect().top

      // Read the row wrapper's top (never animated) instead of the number's own
      // rect, which is translated by the entrance animation and would otherwise
      // require guessing the animation's current offset at measurement time.
      const bounds = rowNodes.current
        .map((rowNode, nodeIndex) => (rowNode ? { rowNode, indexNode: indexNodes.current[nodeIndex] } : null))
        .filter((entry): entry is { rowNode: HTMLDivElement; indexNode: HTMLDivElement } => !!entry?.indexNode)
        .map(({ rowNode, indexNode }) => {
          const top = rowNode.getBoundingClientRect().top - containerTop
          const height = indexNode.getBoundingClientRect().height

          return { top, bottom: top + height }
        })

      if (!bounds.length) return

      let cursor = 0
      const nextSegments: Segment[] = []

      bounds.forEach(bound => {
        nextSegments.push({ start: cursor, end: Math.max(cursor, bound.top - LINE_GAP) })
        cursor = bound.bottom + LINE_GAP
      })

      setSegments(nextSegments)
    }

    measure()

    const observer = new ResizeObserver(measure)

    observer.observe(contentRef.current)

    return () => observer.disconnect()
  }, [data.length])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'end 60%']
  })

  const totalHeight = segments.at(-1)?.end ?? 0
  const revealed = useTransform(scrollYProgress, [0, 1], [0, totalHeight])

  // The glowing head rides the tip of the line and hides in the gaps around each number
  const headOpacity = useTransform(revealed, value =>
    value > 0 && value < totalHeight && segments.some(segment => value >= segment.start && value <= segment.end) ? 1 : 0
  )

  // While the head is moving, throw a spark every few milliseconds. Sparks trail behind the
  // direction of travel and fan out sideways.
  useMotionValueEvent(revealed, 'change', value => {
    if (shouldReduceMotion || headOpacity.get() === 0) return

    const now = performance.now()

    if (now - lastSparkAt.current < SPARK_INTERVAL_MS) return

    lastSparkAt.current = now

    const trailing = value >= (revealed.getPrevious() ?? value) ? -1 : 1

    const burst: Spark[] = Array.from({ length: SPARKS_PER_BURST }, () => ({
      id: sparkId.current++,
      top: value,
      x: (Math.random() - 0.5) * 96,
      y: trailing * (10 + Math.random() * 46),
      size: 4 + Math.random() * 4,
      warm: Math.random() > 0.5
    }))

    setSparks(current => [...current, ...burst].slice(-MAX_SPARKS))
  })

  return (
    <div ref={containerRef} className='relative w-full'>
      <div ref={contentRef} className='relative'>
        <div className='h-16 sm:h-40' />

        {data.map((item, itemIndex) => (
          <TimelineRow
            key={itemIndex}
            {...item}
            isLast={itemIndex === data.length - 1}
            rowRef={node => (rowNodes.current[itemIndex] = node)}
            indexRef={node => (indexNodes.current[itemIndex] = node)}
          />
        ))}

        {segments.map((segment, segmentIndex) => (
          <TimelineSegment key={segmentIndex} start={segment.start} end={segment.end} revealed={revealed} />
        ))}

        {sparks.map(spark => (
          <motion.span
            key={spark.id}
            style={{ top: spark.top, width: spark.size, height: spark.size }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1.2 }}
            animate={{ x: spark.x, y: spark.y, opacity: [1, 1, 0], scale: 0.3 }}
            transition={{ duration: 0.95, ease: 'easeOut' }}
            onAnimationComplete={() => setSparks(current => current.filter(item => item.id !== spark.id))}
            className={cn(
              'pointer-events-none absolute left-8 -translate-x-[2px] -translate-y-1/2 rounded-full shadow-[0_0_10px_3px] sm:left-14',
              spark.warm ? 'bg-amber-400 shadow-amber-400/80' : 'bg-accent shadow-accent/80'
            )}
            aria-hidden='true'
          />
        ))}

        <motion.div
          style={{ top: revealed, opacity: headOpacity }}
          className='bg-accent shadow-accent/60 pointer-events-none absolute left-8 size-2 -translate-x-[3px] -translate-y-1/2 rounded-full shadow-[0_0_10px_3px] transition-opacity duration-200 sm:left-14'
          aria-hidden='true'
        />
      </div>
    </div>
  )
}

export default Timeline
