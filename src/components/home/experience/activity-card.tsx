import { Card, CardContent } from '@/components/ui/card'
import CountUp from '@/components/shared/count-up'

import { cn } from '@/lib/utils'

const HIGHLIGHTS = [
  { value: '$10M+', label: 'Revenue delivered & managed' },
  { value: '50+', label: 'Client engagements' },
  { value: '60', label: 'Largest team led, cross-border' },
  { value: '87%', label: 'Peak process-time reduction' }
]

// Logos in /images/experience that match the toolkit
const TOOLKIT_LOGOS = [
  { src: '/images/experience/img-16.webp', alt: 'React' },
  { src: '/images/experience/img-15.webp', alt: 'Next.js' },
  { src: '/images/experience/img-12.webp', alt: 'TypeScript' },
  { src: '/images/experience/img-07.webp', alt: 'JavaScript' },
  { src: '/images/experience/img-10.webp', alt: 'GitHub' },
  { src: '/images/experience/img-18.webp', alt: 'Claude' },
  { src: '/images/experience/img-03.webp', alt: 'HTML5' },
  { src: '/images/experience/img-20.webp', alt: 'CSS3' }
]

// Project management tools: single-colour icons (from Simple Icons) shown white on their brand colour
const PM_LOGOS = [
  { src: '/images/experience/pm/jira.svg', alt: 'Jira', color: '#0052CC' },
  { src: '/images/experience/pm/confluence.svg', alt: 'Confluence', color: '#172B4D' },
  { src: '/images/experience/pm/clickup.svg', alt: 'ClickUp', color: '#7B68EE' },
  { src: '/images/experience/pm/trello.svg', alt: 'Trello', color: '#0079BF' },
  { src: '/images/experience/pm/asana.svg', alt: 'Asana', color: '#F06A6A' },
  { src: '/images/experience/pm/notion.svg', alt: 'Notion', color: '#000000' },
  { src: '/images/experience/pm/slack.svg', alt: 'Slack', color: '#4A154B' },
  { src: '/images/experience/pm/miro.svg', alt: 'Miro', color: '#050038' },
  { src: '/images/experience/pm/linear.svg', alt: 'Linear', color: '#5E6AD2' },
  { src: '/images/experience/pm/googlesheets.svg', alt: 'Google Sheets', color: '#34A853' },
  { src: '/images/experience/img-13.webp', alt: 'Figma' }
]

type Logo = { src: string; alt: string; color?: string }

// Repeat each list so every marquee row is wider than the card
const LOGO_ROWS: Logo[][] = [
  [...TOOLKIT_LOGOS, ...TOOLKIT_LOGOS],
  [...PM_LOGOS, ...PM_LOGOS]
]

const LogoMark = ({ src, alt, color }: Logo) => {
  if (!color) return <img src={src} alt={alt} className='size-10 grayscale' />

  return (
    <span
      role='img'
      aria-label={alt}
      className='flex size-10 items-center justify-center rounded-lg grayscale'
      style={{ backgroundColor: color }}
    >
      <span
        className='size-5.5 bg-white mask-contain mask-center mask-no-repeat'
        style={{ maskImage: `url(${src})` }}
      />
    </span>
  )
}

const ActivityCard = () => {
  return (
    <Card className='ring-border gap-6 rounded-3xl p-6 shadow-lg lg:mb-16'>
      <CardContent className='p-0'>
        <dl className='grid grid-cols-2 gap-6 md:grid-cols-4'>
          {HIGHLIGHTS.map(highlight => (
            <div
              key={highlight.label}
              className='flex flex-col gap-1 md:border-l md:pl-6 md:first:border-l-0 md:first:pl-0'
            >
              <dt className='text-muted-foreground order-2 text-sm'>{highlight.label}</dt>
              <dd className='text-accent order-1 text-3xl font-semibold tabular-nums lg:text-4xl'>
                <CountUp value={highlight.value} />
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>

      <div className='border-border -mx-6 border-t' />

      <div className='min-w-0 space-y-8'>
        {LOGO_ROWS.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className='overflow-hidden mask-[linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]'
          >
            <div
              className={cn(
                'flex w-max animate-[marquee_25s_linear_infinite] gap-8',
                rowIndex % 2 === 1 && 'direction-reverse'
              )}
            >
              {[...row, ...row].map((logo, logoIndex) => (
                <div
                  key={`${logo.src}-${logoIndex}`}
                  className='bg-background flex size-16 shrink-0 items-center justify-center rounded-md'
                >
                  <LogoMark {...logo} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default ActivityCard
