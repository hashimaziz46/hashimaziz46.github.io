import { GraduationCapIcon, MedalIcon } from 'lucide-react'

import { Card } from '@/components/ui/card'
import CardLabel from '@/components/home/about/card-label'

import { cn } from '@/lib/utils'

const DEGREES = [
  {
    title: 'MS Project Management',
    honour: 'Summa cum laude',
    cgpa: '3.96',
    icon: GraduationCapIcon,
    badge: 'bg-accent text-accent-foreground'
  },
  {
    title: 'BS Software Engineering',
    honour: 'Gold Medalist',
    cgpa: '3.57',
    icon: MedalIcon,
    badge: 'bg-linear-to-br from-amber-300 via-yellow-500 to-amber-600 text-white'
  }
]

// One row per degree, leading with the results: honour under the degree, CGPA as the big number
const EducationCard = () => {
  return (
    <Card className='ring-border gap-0 rounded-[24px] bg-(--background-darker) p-5 shadow-none sm:p-6'>
      <CardLabel>Education</CardLabel>

      <ul className='mt-4 flex flex-1 flex-col justify-center divide-y'>
        {DEGREES.map(degree => (
          <li key={degree.title} className='flex items-center gap-4 py-4 first:pt-0 last:pb-0'>
            <span
              className={cn('flex size-11 shrink-0 items-center justify-center rounded-full shadow-md', degree.badge)}
              aria-hidden='true'
            >
              <degree.icon className='size-5.5' />
            </span>

            <div className='min-w-0 flex-1'>
              <p className='text-[15px] leading-snug font-medium'>{degree.title}</p>
              <p className='text-muted-foreground text-sm'>{degree.honour}</p>
            </div>

            <div className='shrink-0 text-right'>
              <p className='text-accent text-2xl leading-none font-semibold tabular-nums'>{degree.cgpa}</p>
              <p className='text-muted-foreground mt-1 font-mono text-[10px] tracking-wide uppercase'>CGPA</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export default EducationCard
