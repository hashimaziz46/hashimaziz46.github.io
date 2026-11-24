import { useRef, useState } from 'react'

import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { MapPinIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import AvailabilityBadge from '@/components/shared/availability-badge'
import CountUp from '@/components/shared/count-up'
import { PROFILE } from '@/consts'
import { cn } from '@/lib/utils'

const STATS = [
  { label: 'Client engagements', value: '50+' },
  { label: 'Largest team led', value: '60' },
  { label: 'Years in software', value: '5' }
]

const ProfileCard = ({ className }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFlipped, setIsFlipped] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })

  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.5 })
  const rotate = useTransform(progress, [0, 0.5, 1], [-4, 0, 4])

  return (
    <div
      ref={containerRef}
      className={cn('bg-background flex flex-col justify-between rounded-2xl border p-6', className)}
    >
      <motion.div
        style={{ rotate }}
        className='-ml-4 origin-bottom perspective-[1500px] sm:w-88 md:-ml-9 md:w-68 lg:-ml-9 lg:w-88'
      >
        <div
          role='button'
          tabIndex={0}
          aria-pressed={isFlipped}
          onClick={() => setIsFlipped(prev => !prev)}
          onKeyDown={event => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              setIsFlipped(prev => !prev)
            }
          }}
          className={cn(
            'relative cursor-pointer transition-transform duration-700 transform-3d',
            isFlipped && 'transform-[rotateY(180deg)]'
          )}
        >
          <Card className='shadow-lg ring-0 backface-hidden dark:ring dark:ring-white/20'>
            <CardContent className='space-y-4'>
              <div className='flex items-start gap-4'>
                <div className='flex grow flex-col items-center gap-4'>
                  <div className='relative'>
                    <Avatar className='size-30'>
                      <AvatarImage src='/images/hashim/avatar.webp' alt={PROFILE.name} />
                      <AvatarFallback>{PROFILE.initials}</AvatarFallback>
                    </Avatar>
                    <span className='absolute -bottom-3 left-[50%] flex size-7.5 -translate-x-1/2 items-center justify-center'>
                      <img src='/images/hire-me/profile-star-icon.webp' alt='Verified' />
                    </span>
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold lg:text-[36px]'>{PROFILE.name}</h3>
                    <p className='text-muted-foreground flex items-center justify-center gap-1 text-base font-medium'>
                      <MapPinIcon className='fill-muted-foreground text-card size-5' />
                      {PROFILE.location}
                    </p>
                  </div>
                </div>

                <div className='divide-border divide-y text-center'>
                  {STATS.map(stat => (
                    <div key={stat.label} className='py-1.5 first:pt-0 last:pb-0'>
                      <p className='text-foreground text-xl font-semibold tabular-nums lg:text-[26px]'>
                        <CountUp value={stat.value} />
                      </p>
                      <p className='text-base'>{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back: the site's orange, with a soft dot grid and glow instead of a photo */}
          <Card className='from-accent absolute inset-0 transform-[rotateY(180deg)] overflow-hidden rounded-[24px] bg-linear-to-br to-red-600 text-white shadow-lg ring-0 backface-hidden dark:ring dark:ring-white/20'>
            <div
              aria-hidden='true'
              className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgb(255_255_255/0.22)_1px,transparent_1.5px)] mask-[linear-gradient(to_bottom_left,black,transparent_70%)] bg-size-[14px_14px]'
            />
            <div
              aria-hidden='true'
              className='pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-white/20 blur-2xl'
            />

            <CardContent className='relative flex h-full flex-col justify-between gap-6'>
              <div>
                <p className='text-xs text-white/75'>{PROFILE.name}</p>
                <h3 className='text-base font-medium'>Building software since 2021</h3>
              </div>

              <div className='flex items-end justify-between gap-3'>
                <p className='text-base'>
                  I bridge technical and business goals so teams ship predictably and clients stay for the long term.
                </p>
                <Avatar className='h-24.5 w-20.5 shrink-0 rounded-[12px] shadow-lg ring-2 ring-white/70'>
                  <AvatarImage src='/images/hashim/avatar.webp' alt={PROFILE.name} className='rounded-[12px]' />
                  <AvatarFallback>{PROFILE.initials}</AvatarFallback>
                </Avatar>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <div className='mt-6 space-y-3'>
        <AvailabilityBadge className='h-6.5 gap-1 rounded-full' />

        <p className='mb-2 text-xl font-medium sm:text-2xl lg:text-[30px]'>Let&apos;s work together</p>

        <p className='text-muted-foreground text-base'>
          Open to full-time Project Manager and Scrum Master roles, and to delivery consulting engagements.
        </p>
      </div>
    </div>
  )
}

export default ProfileCard
