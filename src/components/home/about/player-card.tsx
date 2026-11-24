import { useEffect, useState } from 'react'

import { BikeIcon, Gamepad2Icon, TentIcon, TrophyIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { toast } from 'sonner'

import { PROFILE } from '@/consts'
import { cn } from '@/lib/utils'

const LEVEL = 5

// Hobbies framed as character stats; the bar values are just for fun
const STATS = [
  { label: 'Endurance', hobby: 'Bike rides', value: 85, icon: BikeIcon },
  { label: 'Strategy', hobby: 'Gaming', value: 92, icon: Gamepad2Icon },
  { label: 'Survival', hobby: 'Camping', value: 78, icon: TentIcon }
]

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a'
]

type BarProps = {
  value: number
  delay?: number
  className?: string
}

const Bar = ({ value, delay = 0, className }: BarProps) => (
  <div className={cn('bg-background h-1.5 overflow-hidden rounded-full', className)}>
    <motion.div
      initial={{ width: 0 }}
      whileInView={{ width: `${value}%` }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, delay, ease: 'easeOut' }}
      className='bg-accent h-full rounded-full'
    />
  </div>
)

const PlayerCard = () => {
  // Bumped on hover to remount the bars so they fill again
  const [replay, setReplay] = useState(0)
  const [unlocked, setUnlocked] = useState(false)

  useEffect(() => {
    let position = 0

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null

      if (target?.closest('input, textarea, select, [contenteditable]')) return

      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key

      position = key === KONAMI_CODE[position] ? position + 1 : key === KONAMI_CODE[0] ? 1 : 0

      if (position === KONAMI_CODE.length) {
        position = 0
        setUnlocked(true)
        toast.success('Achievement unlocked', { description: 'You found the secret. Now say hi on LinkedIn.' })
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div
      onMouseEnter={() => setReplay(prev => prev + 1)}
      className='flex h-full flex-col justify-center gap-5 sm:flex-row sm:items-center sm:gap-8'
    >
      <div className='space-y-3 sm:w-[45%]'>
        <div className='flex items-center gap-3'>
          <div className='relative shrink-0'>
            <img
              src='/images/hashim/avatar.webp'
              alt={PROFILE.name}
              className='ring-accent size-14 rounded-full object-cover ring-2'
            />
            <span className='bg-accent text-accent-foreground absolute -right-1 -bottom-1 rounded-full px-1.5 font-mono text-[10px] leading-4 font-semibold'>
              LV {LEVEL}
            </span>
          </div>
          <div>
            <p className='text-lg leading-tight font-semibold'>{PROFILE.firstName}</p>
            <p className='text-muted-foreground text-xs'>Class: Project Manager</p>
          </div>
        </div>

        <div className='space-y-1'>
          <div className='text-muted-foreground flex justify-between font-mono text-[10px] uppercase'>
            <span>XP · {LEVEL} yrs in software</span>
            <span>LV {LEVEL + 1}</span>
          </div>
          <Bar key={replay} value={50} />
        </div>
      </div>

      <div className='flex-1 space-y-3'>
        {STATS.map((stat, index) => (
          <div key={stat.label} className='flex items-center gap-3'>
            <span className='bg-background text-accent flex size-8 shrink-0 items-center justify-center rounded-lg'>
              <stat.icon className='size-4.5' aria-hidden='true' />
            </span>
            <div className='flex-1 space-y-1'>
              <div className='flex items-baseline justify-between gap-2'>
                <p className='text-sm font-medium'>
                  {stat.label} <span className='text-muted-foreground font-normal'>· {stat.hobby}</span>
                </p>
                <span className='text-muted-foreground font-mono text-xs tabular-nums'>{stat.value}</span>
              </div>
              <Bar key={replay} value={stat.value} delay={0.1 * (index + 1)} />
            </div>
          </div>
        ))}

        <p
          className={cn(
            'flex items-center justify-end gap-1.5 font-mono text-[10px] max-lg:hidden',
            unlocked ? 'text-accent' : 'text-muted-foreground/60'
          )}
        >
          {unlocked ? (
            <>
              <TrophyIcon className='size-3' aria-hidden='true' /> Secret found
            </>
          ) : (
            '↑ ↑ ↓ ↓ ← → ← → B A'
          )}
        </p>
      </div>
    </div>
  )
}

export default PlayerCard
