import { useEffect, useRef, useState } from 'react'

import { FlameIcon, MoonIcon, TreePineIcon } from 'lucide-react'

import CardLabel from '@/components/home/about/card-label'

import { cn } from '@/lib/utils'

// Positions are percentages of the sky area; delays stagger the twinkle
const STARS = [
  { top: '14%', left: '8%', delay: '0s' },
  { top: '30%', left: '19%', delay: '1.2s' },
  { top: '10%', left: '31%', delay: '0.6s' },
  { top: '36%', left: '43%', delay: '1.8s' },
  { top: '16%', left: '55%', delay: '0.3s' },
  { top: '32%', left: '66%', delay: '2.1s' },
  { top: '12%', left: '78%', delay: '0.9s' },
  { top: '40%', left: '90%', delay: '1.5s' }
]

// Negative delays start each cloud part-way across so the sky is never empty
const CLOUDS = [
  { top: '34%', width: 'w-20', duration: '70s', delay: '-12s', opacity: 'opacity-90' },
  { top: '46%', width: 'w-14', duration: '95s', delay: '-55s', opacity: 'opacity-70' },
  { top: '30%', width: 'w-24', duration: '120s', delay: '-80s', opacity: 'opacity-80' }
]

const BIRDS = [
  { top: '46%', size: 'w-4', duration: '22s', delay: '-4s' },
  { top: '55%', size: 'w-3', duration: '26s', delay: '-9s' }
]

const TREES = [
  { left: 'left-[5%]', size: 'size-14' },
  { left: 'left-[9%]', size: 'size-20' },
  { left: 'left-[15%]', size: 'size-12' }
]

const SMOKE_DELAYS = ['0s', '1s', '2s']

const EXHAUST_DELAYS = ['0s', '0.6s']

const EMBERS = [
  { left: 'left-0', delay: '0s' },
  { left: 'left-2.5', delay: '0.5s' },
  { left: 'left-5', delay: '1s' }
]

// Parked motorbike, drawn filled and shaded with a ground shadow so it sits in the scene
const ParkedMotorbike = ({ on, className }: { on: boolean; className?: string }) => (
  <svg
    viewBox='0 0 72 44'
    fill='none'
    strokeLinecap='round'
    strokeLinejoin='round'
    className={className}
    aria-hidden='true'
  >
    <ellipse cx='36' cy='42' rx='31' ry='1.8' className='fill-black/20' />

    {/* Headlight beam, only while the engine is on */}
    {on && <polygon points='56,15.5 104,5 104,31' className='fill-amber-300/60 dark:fill-amber-100/35' />}

    {/* Kickstand */}
    <path d='M31 34 L27 41.5' strokeWidth='1.25' className='stroke-stone-600 dark:stroke-stone-400' />

    {[14, 58].map(cx => (
      <g key={cx}>
        <circle cx={cx} cy='31' r='8.5' strokeWidth='4' className='stroke-stone-800 dark:stroke-stone-300' />
        <circle cx={cx} cy='31' r='5.2' strokeWidth='0.75' className='stroke-stone-400 dark:stroke-stone-500' />
        <circle cx={cx} cy='31' r='2.6' className='fill-stone-400' />
        <circle cx={cx} cy='31' r='1' className='fill-stone-700' />
      </g>
    ))}

    {/* Swingarm, frame and front fork */}
    <path
      d='M14 31 H31 M47 19 L40 33 M24 22 L30 31'
      strokeWidth='2.25'
      className='stroke-stone-600 dark:stroke-stone-400'
    />
    <path d='M50 16 L58 31' strokeWidth='2.75' className='stroke-stone-400' />
    <path d='M49.2 17.5 L52.5 23.5' strokeWidth='3.5' className='stroke-stone-700 dark:stroke-stone-500' />

    {/* Engine with cooling fins, then a chrome exhaust running back */}
    <rect x='28' y='23.5' width='13' height='11' rx='2' className='fill-stone-600' />
    <rect x='30' y='21' width='8' height='4' rx='1' className='fill-stone-500' />
    <path d='M30 27 H39 M30 29.5 H39 M30 32 H39' strokeWidth='0.6' className='stroke-stone-400' />
    <path d='M37 35 H23 L7 29.5' strokeWidth='3' className='stroke-stone-400' />
    <path d='M36 34.2 H23.5 L9 29' strokeWidth='0.6' className='stroke-white/70' />

    {/* Fenders */}
    <path d='M6 24 Q14 16 23 23' strokeWidth='2.5' className='stroke-accent' />
    <path d='M50 25 Q58 17.5 66 25.5' strokeWidth='2.5' className='stroke-accent' />

    {/* Seat and tail */}
    <path d='M13 19.5 Q22 16.5 31 17.5 L31 22 H17 Q13 22 13 19.5 Z' className='fill-stone-800 dark:fill-stone-300' />
    <path d='M8 18.5 L16 18 L17 22 H12 Z' className='fill-accent' />
    <circle cx='8.6' cy='20' r='1.1' className='fill-red-500' />

    {/* Tank: shadow copy, body, highlight */}
    <path d='M30 17 Q38 10.5 49 15 L46.5 22.5 H31 Z' transform='translate(0.9 0.9)' className='fill-black/35' />
    <path d='M30 17 Q38 10.5 49 15 L46.5 22.5 H31 Z' className='fill-accent' />
    <path d='M34 15.6 Q39 13 45 14.8' strokeWidth='0.8' className='stroke-white/60' />

    {/* Handlebar and headlight */}
    <path d='M49 15 L47 8.5 H42.5' strokeWidth='2' className='stroke-stone-800 dark:stroke-stone-200' />
    <circle
      cx='53'
      cy='15.5'
      r='3'
      strokeWidth='1'
      className={cn('stroke-stone-700', on ? 'fill-amber-300' : 'fill-stone-200')}
    />
  </svg>
)

// A-frame tent seen at an angle: lit front face, shaded side panel receding, and an open door
const CampTent = ({ lit, className }: { lit: boolean; className?: string }) => (
  <svg
    viewBox='0 0 96 64'
    fill='none'
    strokeLinecap='round'
    strokeLinejoin='round'
    className={className}
    aria-hidden='true'
  >
    <ellipse cx='48' cy='61.6' rx='45' ry='2.2' className='fill-black/20' />

    {/* Guy ropes */}
    <path d='M30 12 L1 59 M62 8 L95 58' strokeWidth='0.6' className='stroke-stone-500' />

    {/* Side panel, then the front face */}
    <polygon points='62,8 30,12 6,58 40,60' className='fill-amber-500 dark:fill-amber-700' />
    <path d='M46 10 L23 59' strokeWidth='0.6' className='stroke-amber-700/60 dark:stroke-amber-900' />
    <polygon points='62,8 40,60 88,60' className='fill-amber-300 dark:fill-amber-500' />

    {/* Door opening with the flap pulled aside */}
    <polygon
      points='62,22 53,60 71,60'
      className={cn('transition-colors duration-300', lit ? 'fill-amber-200' : 'fill-stone-800 dark:fill-stone-950')}
    />
    {lit && (
      <>
        <circle cx='62' cy='44' r='7' className='fill-amber-400/50 blur-[2px]' />
        <circle cx='62' cy='44' r='2.2' className='fill-white' />
      </>
    )}
    <polygon points='62,22 71,60 78,60' className='fill-amber-100 dark:fill-amber-300' />

    {/* Ridge highlight, front edge and crossed poles at the peak */}
    <path d='M30 12 L62 8' strokeWidth='1' className='stroke-white/60' />
    <path d='M62 8 L40 60' strokeWidth='1' className='stroke-amber-700/70 dark:stroke-amber-900' />
    <path d='M62 8 L59.5 3 M62 8 L65 3' strokeWidth='1.5' className='stroke-stone-700 dark:stroke-stone-300' />
  </svg>
)

// Small wooden desk with a monitor mid-game and a controller left on the table
const GamingDesk = ({ score }: { score: number }) => (
  <svg viewBox='0 0 56 50' className='relative w-full' aria-hidden='true'>
    <defs>
      <linearGradient id='off-clock-screen' x1='0' y1='0' x2='0' y2='1'>
        <stop offset='0' stopColor='#312e81' />
        <stop offset='1' stopColor='#6366f1' />
      </linearGradient>
    </defs>

    <ellipse cx='28' cy='48.2' rx='25' ry='1.6' className='fill-black/20' />

    {/* Legs: back pair darker and shorter, front pair in front */}
    <rect x='11' y='31' width='2.5' height='13' className='fill-amber-950' />
    <rect x='42.5' y='31' width='2.5' height='13' className='fill-amber-950' />
    <rect x='6' y='31' width='3' height='17' className='fill-amber-900' />
    <rect x='47' y='31' width='3' height='17' className='fill-amber-900' />

    {/* Table top seen slightly from above, with a front edge */}
    <polygon points='10,24 46,24 51,29 5,29' className='fill-amber-600' />
    <rect x='5' y='29' width='46' height='3' rx='0.5' className='fill-amber-800' />

    {/* Monitor */}
    <ellipse cx='28' cy='26.5' rx='6' ry='1.5' className='fill-stone-700' />
    <rect x='26.5' y='19' width='3' height='7' className='fill-stone-600' />
    <rect x='13.2' y='2' width='32' height='19' rx='2' className='fill-stone-950' />
    <rect x='12' y='1' width='32' height='19' rx='2' className='fill-stone-800' />
    <rect x='14' y='3' width='28' height='15' rx='1' fill='url(#off-clock-screen)' />

    {/* A tiny platformer on screen */}
    <rect x='14' y='15' width='28' height='3' className='fill-emerald-500' />
    <rect x='28' y='10.5' width='8' height='1.5' className='fill-amber-300' />
    <rect
      key={score}
      x='19'
      y='12'
      width='3'
      height='3'
      className={cn('fill-rose-400', score > 0 && 'animate-[hop_0.45s_ease-out] motion-reduce:animate-none')}
    />
    <circle
      cx='20.5'
      cy='7'
      r='1.2'
      className='animate-[twinkle_1.2s_ease-in-out_infinite] fill-yellow-300 motion-reduce:animate-none'
    />
    <rect x='33' y='5' width='6' height='1' rx='0.5' className='fill-white/70' />

    {/* Controller */}
    <rect x='37' y='25.3' width='8' height='2.8' rx='1.4' className='fill-stone-800' />
    <circle cx='39' cy='26.7' r='0.5' className='fill-stone-400' />
    <circle cx='43' cy='26.7' r='0.5' className='fill-rose-400' />
  </svg>
)

const DEFAULT_CAPTION = 'Somewhere between a bike trail, a campfire and a save point.'
const STOKE_MS = 2500

const HOTSPOT =
  'absolute cursor-pointer rounded-md outline-none transition-transform duration-200 hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-(--accent)'

// Ambient motion is pure CSS. Each camp object is a button with its own small reaction, and the
// caption reports what just happened.
const OffClockScene = () => {
  const [caption, setCaption] = useState(DEFAULT_CAPTION)
  const [engineOn, setEngineOn] = useState(false)
  const [lanternOn, setLanternOn] = useState(false)
  const [stoked, setStoked] = useState(false)
  const [score, setScore] = useState(0)
  const stokeTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(stokeTimer.current), [])

  const toggleEngine = () => {
    setEngineOn(!engineOn)
    setCaption(engineOn ? 'Engine off. Parked up again.' : 'Engine on, headlight up. Ready for a ride.')
  }

  const toggleLantern = () => {
    setLanternOn(!lanternOn)
    setCaption(lanternOn ? 'Lantern off. Lights out.' : 'Lantern on. Someone is home.')
  }

  const stokeFire = () => {
    clearTimeout(stokeTimer.current)
    setStoked(true)
    stokeTimer.current = setTimeout(() => setStoked(false), STOKE_MS)
    setCaption('Fire stoked. Camp is warm.')
  }

  const grabCoin = () => {
    setScore(score + 1)
    setCaption(`Coin grabbed. Score: ${score + 1}`)
  }

  return (
    <div className='group/scene @container relative h-52 overflow-hidden'>
      {/* Daytime sky */}
      <div className='absolute inset-0 bg-linear-to-b from-sky-300 to-sky-100 dark:hidden' />

      <div className='absolute top-5 left-5 z-10 max-w-[60%] space-y-2 sm:top-6 sm:left-6'>
        <CardLabel className='w-fit rounded-full bg-white/80 px-2 py-0.5 dark:bg-black/40'>Off the clock</CardLabel>

        <p aria-live='polite' className='text-sm text-sky-950/70 dark:text-(--muted-foreground)'>
          {caption}
          {caption === DEFAULT_CAPTION && (
            <span className='mt-1 block font-mono text-[10px] tracking-wide uppercase opacity-70'>
              <span className='pointer-coarse:hidden'>Click</span>
              <span className='hidden pointer-coarse:inline'>Tap</span> around the camp
            </span>
          )}
        </p>
      </div>

      {/* Day: sun, drifting clouds and a couple of birds */}
      <div className='absolute top-5 right-[12%] size-9 rounded-full bg-amber-300 shadow-[0_0_24px_8px] shadow-amber-200/70 dark:hidden' />
      {CLOUDS.map(cloud => (
        <svg
          key={cloud.delay}
          viewBox='0 0 64 28'
          style={{ top: cloud.top, animationDuration: cloud.duration, animationDelay: cloud.delay }}
          className={cn(
            'absolute left-0 animate-[drift_linear_infinite] fill-white motion-reduce:translate-x-[30cqw] motion-reduce:animate-none dark:hidden',
            cloud.width,
            cloud.opacity
          )}
          aria-hidden='true'
        >
          <path d='M10 27a9 9 0 0 1 0-18 14 14 0 0 1 26-4 10 10 0 0 1 17 8 7 7 0 0 1 1 14z' />
        </svg>
      ))}
      {BIRDS.map(bird => (
        <div
          key={bird.delay}
          style={{ top: bird.top, animationDuration: bird.duration, animationDelay: bird.delay }}
          className='absolute left-0 animate-[fly_linear_infinite] motion-reduce:hidden dark:hidden'
        >
          <svg
            viewBox='0 0 16 8'
            className={cn(
              'animate-[flap_0.6s_ease-in-out_infinite] fill-none stroke-sky-950/70 stroke-[1.5]',
              bird.size
            )}
            aria-hidden='true'
          >
            <path d='M1 6 Q4 0 8 5 Q12 0 15 6' strokeLinecap='round' />
          </svg>
        </div>
      ))}

      {/* Night: moon, stars and a shooting star */}
      <MoonIcon
        className='absolute top-9 right-[12%] hidden size-7 fill-amber-100 text-amber-100 dark:block'
        aria-hidden='true'
      />
      {STARS.map(star => (
        <span
          key={`${star.top}-${star.left}`}
          style={{ top: star.top, left: star.left, animationDelay: star.delay }}
          className='absolute hidden size-0.5 animate-[twinkle_3s_ease-in-out_infinite] rounded-full bg-white motion-reduce:animate-none dark:block'
        />
      ))}
      <span className='absolute top-[12%] left-[48%] hidden h-px w-10 -rotate-25 animate-[shoot_9s_ease-in_infinite] bg-linear-to-r from-white to-transparent opacity-0 motion-reduce:animate-none dark:block' />

      {/* Hills, two layers for depth */}
      <svg
        viewBox='0 0 1200 120'
        preserveAspectRatio='none'
        className='absolute inset-x-0 bottom-0 h-32 w-full fill-emerald-200 dark:fill-(--background) dark:opacity-40'
        aria-hidden='true'
      >
        <path d='M0 120 L0 70 Q200 0 420 60 T820 40 Q1000 0 1200 60 L1200 120 Z' />
      </svg>
      <svg
        viewBox='0 0 1200 120'
        preserveAspectRatio='none'
        className='absolute inset-x-0 bottom-0 h-24 w-full fill-emerald-300 dark:fill-(--background) dark:opacity-70'
        aria-hidden='true'
      >
        <path d='M0 120 L0 80 Q150 10 320 70 T640 60 Q800 0 960 60 T1200 50 L1200 120 Z' />
      </svg>

      {/* Pines */}
      {TREES.map(tree => (
        <TreePineIcon
          key={tree.left}
          strokeWidth={1.25}
          className={cn(
            'absolute bottom-8 hidden fill-emerald-600 text-emerald-800 @md:block dark:fill-emerald-950 dark:text-emerald-900',
            tree.left,
            tree.size
          )}
          aria-hidden='true'
        />
      ))}

      {/* Camp: tent, fire, a gaming desk and the motorbike parked up. Each one is clickable. */}
      <button
        type='button'
        onClick={toggleLantern}
        aria-pressed={lanternOn}
        aria-label='Tent lantern'
        data-cursor='pointer'
        className={cn(HOTSPOT, 'right-[calc(3%+3.25rem)] bottom-8 w-24')}
      >
        <CampTent lit={lanternOn} className='w-full' />
      </button>
      <button
        type='button'
        onClick={stokeFire}
        aria-label='Stoke the campfire'
        data-cursor='pointer'
        className={cn(HOTSPOT, 'right-[calc(3%+10rem)] bottom-9 before:absolute before:-inset-2')}
      >
        {SMOKE_DELAYS.map(delay => (
          <span
            key={delay}
            style={{ animationDelay: delay }}
            className='absolute -top-1 left-2 size-2 animate-[rise_3s_ease-out_infinite] rounded-full bg-stone-400/60 opacity-0 motion-reduce:animate-none dark:bg-white/25'
          />
        ))}
        {EMBERS.map(ember => (
          <span
            key={ember.left}
            style={{ animationDelay: ember.delay }}
            className={cn(
              'absolute top-0 size-0.5 animate-[rise_1.5s_ease-out_infinite] rounded-full bg-amber-400 opacity-0 motion-reduce:animate-none',
              stoked ? 'block' : 'hidden group-hover/scene:block',
              ember.left
            )}
          />
        ))}
        <span
          className={cn(
            'absolute -inset-3 animate-[flicker_1.6s_ease-in-out_infinite] rounded-full bg-orange-500/30 blur-md transition-transform duration-500 group-hover/scene:scale-150 motion-reduce:animate-none',
            stoked && 'scale-200'
          )}
        />
        <span
          className={cn(
            'block origin-bottom transition-transform duration-500 group-hover/scene:scale-140',
            stoked && 'scale-175 group-hover/scene:scale-175'
          )}
        >
          <FlameIcon
            className='relative size-6 origin-bottom animate-[flicker_0.8s_ease-in-out_infinite] fill-amber-400 text-orange-500 motion-reduce:animate-none'
            aria-hidden='true'
          />
        </span>
      </button>
      <button
        type='button'
        onClick={grabCoin}
        aria-label='Play the game'
        data-cursor='pointer'
        className={cn(HOTSPOT, 'right-[3%] bottom-9 w-11')}
      >
        <span className='absolute inset-x-1 top-0 h-5 animate-pulse rounded-md bg-sky-400/50 blur-md motion-reduce:animate-none' />
        <GamingDesk score={score} />
      </button>
      <button
        type='button'
        onClick={toggleEngine}
        aria-pressed={engineOn}
        aria-label='Motorbike engine'
        data-cursor='pointer'
        className={cn(HOTSPOT, 'right-[calc(3%+12.25rem)] bottom-9 w-16')}
      >
        {engineOn &&
          EXHAUST_DELAYS.map(delay => (
            <span
              key={delay}
              style={{ animationDelay: delay }}
              className='absolute bottom-3 -left-1 size-1.5 animate-[rise_1.2s_ease-out_infinite] rounded-full bg-stone-400/70 opacity-0 motion-reduce:hidden dark:bg-white/30'
            />
          ))}
        <ParkedMotorbike
          key={String(engineOn)}
          on={engineOn}
          className={cn(
            'block w-full overflow-visible',
            engineOn && 'animate-[rev_0.15s_linear_6] motion-reduce:animate-none'
          )}
        />
      </button>

      {/* Trail along the foot of the hill */}
      <div className='absolute inset-x-0 bottom-4 border-t border-dashed border-emerald-800/25 dark:border-white/10' />
    </div>
  )
}

export default OffClockScene
