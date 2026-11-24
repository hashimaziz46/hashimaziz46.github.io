import { cn } from '@/lib/utils'

export type ServicePreviewData = {
  kind: 'bars' | 'roadmap' | 'gauge' | 'checklist' | 'drop'
  label: string
  stat: string
  caption: string
  source: string
}

const MUTED = 'fill-neutral-200 dark:fill-neutral-700'
const MUTED_STROKE = 'stroke-neutral-200 dark:stroke-neutral-700'
const LABEL = 'fill-neutral-500 dark:fill-neutral-400 font-mono text-[8px]'

// Sprint-over-sprint velocity: grey early sprints, accent for the improved ones, plus a trend line
const BarsChart = () => {
  const heights = [22, 28, 26, 36, 44, 52]

  return (
    <>
      <path d='M4 66 H156' strokeWidth='1' className={MUTED_STROKE} />
      {heights.map((height, index) => (
        <rect
          key={index}
          x={10 + index * 25}
          y={66 - height}
          width='15'
          height={height}
          rx='3'
          className={index > 2 ? 'fill-accent' : MUTED}
        />
      ))}
      <path
        d='M17 40 L42 34 L67 36 L92 26 L117 18 L142 10'
        fill='none'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeDasharray='3 3'
        className='stroke-neutral-400 dark:stroke-neutral-500'
      />
      <text x='10' y='77' className={LABEL}>
        Sprint 1
      </text>
      <text x='150' y='77' textAnchor='end' className={LABEL}>
        Sprint 6
      </text>
    </>
  )
}

// A scoped roadmap: workstreams laid out over time with a delivery milestone
const RoadmapChart = () => {
  const rows = [
    { x: 6, width: 52, accent: false },
    { x: 34, width: 60, accent: true },
    { x: 70, width: 46, accent: false },
    { x: 96, width: 54, accent: true }
  ]

  return (
    <>
      {[44, 82, 120].map(x => (
        <path key={x} d={`M${x} 4 V68`} strokeWidth='1' strokeDasharray='2 3' className={MUTED_STROKE} />
      ))}
      {rows.map((row, index) => (
        <rect
          key={index}
          x={row.x}
          y={8 + index * 15}
          width={row.width}
          height='9'
          rx='4.5'
          className={row.accent ? 'fill-accent' : MUTED}
        />
      ))}
      <rect
        x='147'
        y='51'
        width='8'
        height='8'
        transform='rotate(45 151 55)'
        className='fill-neutral-800 dark:fill-neutral-100'
      />
      <text x='6' y='77' className={LABEL}>
        Discovery
      </text>
      <text x='156' y='77' textAnchor='end' className={LABEL}>
        Delivery
      </text>
    </>
  )
}

// Satisfaction gauge: an arc filled to 80%
const GaugeChart = () => {
  const radius = 30
  const circumference = Math.PI * radius

  return (
    <>
      <path
        d='M50 62 A30 30 0 0 1 110 62'
        fill='none'
        strokeWidth='10'
        strokeLinecap='round'
        className={MUTED_STROKE}
      />
      <path
        d='M50 62 A30 30 0 0 1 110 62'
        fill='none'
        strokeWidth='10'
        strokeLinecap='round'
        strokeDasharray={`${circumference * 0.8} ${circumference}`}
        className='stroke-accent'
      />
      <text
        x='80'
        y='60'
        textAnchor='middle'
        className='fill-neutral-800 text-[13px] font-semibold dark:fill-neutral-100'
      >
        CSAT
      </text>
      <text x='42' y='76' textAnchor='middle' className={LABEL}>
        0
      </text>
      <text x='118' y='76' textAnchor='middle' className={LABEL}>
        100
      </text>
    </>
  )
}

// Audit checklist with every control ticked off
const ChecklistChart = () => {
  const widths = [96, 78, 104, 66]

  return (
    <>
      {widths.map((width, index) => (
        <g key={index} transform={`translate(8 ${6 + index * 18})`}>
          <circle cx='7' cy='7' r='7' className='fill-accent' />
          <path
            d='M3.8 7.2 L6.2 9.6 L10.4 4.8'
            fill='none'
            strokeWidth='1.6'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='stroke-white'
          />
          <rect x='22' y='4' width={width} height='6' rx='3' className={MUTED} />
        </g>
      ))}
    </>
  )
}

// Review time falling from two hours to fifteen minutes once the automation lands
const DropChart = () => (
  <>
    <path d='M4 66 H156' strokeWidth='1' className={MUTED_STROKE} />
    <path d='M10 12 C40 12 52 14 74 34 S118 56 150 58 V66 H10 Z' className='fill-accent/15' />
    <path
      d='M10 12 C40 12 52 14 74 34 S118 56 150 58'
      fill='none'
      strokeWidth='2.25'
      strokeLinecap='round'
      className='stroke-accent'
    />
    <circle cx='10' cy='12' r='3' className='fill-neutral-400 dark:fill-neutral-500' />
    <circle cx='150' cy='58' r='3.5' className='fill-accent' />
    <text x='18' y='10' className={LABEL}>
      2 hrs
    </text>
    <text x='150' y='50' textAnchor='end' className={LABEL}>
      15 min
    </text>
    <text x='10' y='77' className={LABEL}>
      Manual
    </text>
    <text x='150' y='77' textAnchor='end' className={LABEL}>
      Automated
    </text>
  </>
)

const CHARTS = {
  bars: BarsChart,
  roadmap: RoadmapChart,
  gauge: GaugeChart,
  checklist: ChecklistChart,
  drop: DropChart
}

// A small result card for one service: the headline number, a chart that fits it, and where it came from
const ServicePreview = ({ preview, className }: { preview: ServicePreviewData; className?: string }) => {
  const Chart = CHARTS[preview.kind]

  return (
    <div className={cn('space-y-2', className)}>
      <div>
        <p className='font-mono text-[10px] tracking-wide text-neutral-500 uppercase dark:text-neutral-400'>
          {preview.label}
        </p>
        <p className='text-accent text-2xl leading-tight font-semibold'>{preview.stat}</p>
      </div>
      <svg viewBox='0 0 160 80' className='w-full' aria-hidden='true'>
        <Chart />
      </svg>
      <p className='text-[11px] leading-snug text-neutral-600 dark:text-neutral-300'>
        {preview.caption} <span className='text-neutral-400 dark:text-neutral-500'>· {preview.source}</span>
      </p>
    </div>
  )
}

export default ServicePreview
