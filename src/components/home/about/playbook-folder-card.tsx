import { useState } from 'react'

import { AnimatePresence } from 'motion/react'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import CardLabel from '@/components/home/about/card-label'
import PlaybookPeek, { type PlaybookDoc } from '@/components/home/about/playbook-peek'

import { cn } from '@/lib/utils'

type FolderDoc = PlaybookDoc & {
  tab: string
  layer: string
  collapsed: string
  hover: string
  expanded: string
}

// Frameworks from past engagements, drawn as sheets tucked in the folder. Each opens a short peek.
// At rest the sheets are staggered so each one's colour tab and title peek out above the folder.
const DOCS: FolderDoc[] = [
  {
    title: 'Risk register',
    usedAt: 'Shippeo',
    summary: 'A living list of what could derail the sprint, reviewed before problems reach delivery.',
    kind: 'table',
    rows: [
      { risk: 'API mapping mismatches', mitigation: 'Caught in the register before they hit sprint delivery' },
      { risk: 'Invalid data formats', mitigation: 'Also caught before sprint delivery' },
      { risk: 'Blockers surfacing late', mitigation: 'Bi-weekly alignment with the Tech Lead and client' }
    ],
    result: '2,500 telematics units shipped a month ahead of deadline.',
    tab: 'bg-rose-400',
    layer: 'z-1',
    collapsed: '-rotate-[4deg] -translate-x-3 -translate-y-[68px]',
    hover: 'group-hover/folder:-rotate-[6deg] group-hover/folder:-translate-x-5 group-hover/folder:-translate-y-[78px]',
    expanded: '-translate-x-20 -rotate-[12deg] -translate-y-16'
  },
  {
    title: 'QA test templates',
    usedAt: 'Drata',
    summary: 'A structured QA process so a 50+ component migration could ship under continuous deployment.',
    kind: 'checklist',
    items: [
      'Test case templates for every component',
      'Centralized issue-log dashboard',
      'Least-used components migrated first',
      'Bi-weekly client review of the backlog'
    ],
    result: '5% more testing throughput and ~4 hours saved per incident.',
    tab: 'bg-sky-400',
    layer: 'z-2',
    collapsed: 'rotate-[2deg] translate-x-2 -translate-y-[48px]',
    hover: 'group-hover/folder:rotate-[3deg] group-hover/folder:translate-x-3 group-hover/folder:-translate-y-[58px]',
    expanded: '-translate-x-7 -rotate-[4deg] -translate-y-19'
  },
  {
    title: 'Offboarding framework',
    usedAt: 'Search Acumen',
    summary: 'A standard way to hand a project over, so nothing is lost when a team rolls off.',
    kind: 'steps',
    items: ['Standardized offboarding checklist', 'Full documentation', 'Code handover'],
    result: 'Zero delays at handover, and a 5% gain in operational efficiency.',
    tab: 'bg-emerald-400',
    layer: 'z-3',
    collapsed: '-rotate-[1deg] -translate-x-1 -translate-y-[28px]',
    hover: 'group-hover/folder:-rotate-[2deg] group-hover/folder:-translate-x-2 group-hover/folder:-translate-y-[38px]',
    expanded: 'translate-x-7 rotate-[4deg] -translate-y-19'
  },
  {
    title: 'Governance cadence',
    usedAt: 'Geeks Ltd',
    summary: 'A weekly rhythm that keeps a portfolio of 18 concurrent projects visible and on track.',
    kind: 'checklist',
    items: [
      'Weekly delivery and PM governance sessions',
      'Cross-project visibility',
      'Proactive risk management',
      'Effective change request management'
    ],
    result: 'An average CSAT score above 80%.',
    tab: 'bg-violet-400',
    layer: 'z-4',
    collapsed: 'rotate-[1deg] translate-x-1 -translate-y-[8px]',
    hover: 'group-hover/folder:rotate-[2deg] group-hover/folder:translate-x-2 group-hover/folder:-translate-y-[18px]',
    expanded: 'translate-x-20 -translate-y-16 rotate-[12deg]'
  }
]

const SHEET_LINE_WIDTHS = ['w-full', 'w-4/5', 'w-full', 'w-3/5']

const PlaybookFolderCard = () => {
  const [expanded, setExpanded] = useState(false)
  const [openDoc, setOpenDoc] = useState<FolderDoc | null>(null)

  return (
    <Card
      onClick={() => setExpanded(prev => !prev)}
      data-cursor='pointer'
      className='ring-border cursor-pointer gap-0 overflow-visible rounded-[24px] bg-(--background-darker) p-5 shadow-none sm:p-6'
    >
      <div className='flex items-center justify-between gap-3'>
        <CardLabel>Playbook</CardLabel>
        <Badge
          variant='secondary'
          className='text-muted-foreground dark:bg-background h-6 rounded-full bg-white font-normal'
        >
          {expanded ? 'Pick a sheet' : '4 frameworks · open me'}
        </Badge>
      </div>

      <div className='group/folder relative mt-3 flex min-h-44 flex-1 items-end justify-center'>
        {/* Back of the folder, with its tab, behind the sheets */}
        <div className='absolute bottom-0 left-1/2 z-0 h-32 w-40 -translate-x-1/2 rounded-xl rounded-tl-none bg-orange-700 dark:bg-orange-800'>
          <span className='absolute -top-3 left-0 h-3.5 w-16 rounded-t-lg bg-orange-700 dark:bg-orange-800' />
        </div>

        {DOCS.map(doc => (
          <button
            key={doc.title}
            type='button'
            tabIndex={expanded ? 0 : -1}
            aria-label={`Open ${doc.title}`}
            data-cursor='pointer'
            onClick={event => {
              // While the folder is closed, let the click fall through and open it
              if (!expanded) return

              event.stopPropagation()
              setOpenDoc(doc)
            }}
            className={cn(
              'absolute aspect-290/230 h-auto w-36 cursor-pointer overflow-hidden rounded-md border border-neutral-200 bg-white p-2.5 pt-2 text-left shadow-sm transition-all duration-500',
              doc.layer,
              expanded
                ? cn(doc.expanded, 'hover:z-20 hover:-translate-y-24 hover:shadow-lg focus-visible:z-20')
                : cn(doc.collapsed, doc.hover)
            )}
          >
            <span className={cn('absolute inset-x-0 top-0 h-1', doc.tab)} />
            <p className='text-[11px] leading-tight font-semibold text-neutral-800'>{doc.title}</p>
            <div className='mt-2 space-y-1.5'>
              {SHEET_LINE_WIDTHS.map((width, lineIndex) => (
                <div key={lineIndex} className={cn('h-1 rounded-full bg-neutral-200', width)} />
              ))}
            </div>
          </button>
        ))}

        {/* Front of the folder; it tips forward more as the folder opens */}
        <div
          className={cn(
            'relative z-10 origin-bottom transform-[perspective(2000px)_rotateX(-25deg)] transition-transform duration-500',
            !expanded && 'hover:transform-[perspective(3000px)_rotateX(-35deg)]',
            expanded && 'transform-[perspective(4000px)_rotateX(-45deg)]'
          )}
        >
          <div className='to-accent relative h-26 w-40 rounded-xl bg-linear-to-b from-orange-400 shadow-[0_-4px_12px_rgba(0,0,0,0.12)] ring-1 ring-black/5'>
            <span className='absolute top-3 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full bg-white/35' />
          </div>
        </div>
      </div>

      <AnimatePresence>{openDoc && <PlaybookPeek doc={openDoc} onClose={() => setOpenDoc(null)} />}</AnimatePresence>
    </Card>
  )
}

export default PlaybookFolderCard
