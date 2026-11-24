import { useEffect } from 'react'
import { createPortal } from 'react-dom'

import { CheckIcon, XIcon } from 'lucide-react'
import { motion } from 'motion/react'

import { Button } from '@/components/ui/button'

export type PlaybookDoc = {
  title: string
  usedAt: string
  summary: string
  result: string
} & (
  | { kind: 'table'; rows: { risk: string; mitigation: string }[] }
  | { kind: 'checklist'; items: string[] }
  | { kind: 'steps'; items: string[] }
)

type PlaybookPeekProps = {
  doc: PlaybookDoc
  onClose: () => void
}

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.25 } }
}

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0 }
}

const markVariants = {
  hidden: { scale: 0 },
  visible: { scale: 1, transition: { type: 'spring' as const, stiffness: 400, damping: 15 } }
}

const PeekBody = ({ doc }: { doc: PlaybookDoc }) => {
  if (doc.kind === 'table') {
    return (
      <motion.div
        variants={listVariants}
        initial='hidden'
        animate='visible'
        className='overflow-hidden rounded-lg border'
      >
        <div className='text-muted-foreground grid grid-cols-2 gap-3 bg-(--background-darker) px-3 py-2 text-xs font-medium tracking-wide uppercase'>
          <span>Risk</span>
          <span>Mitigation</span>
        </div>
        {doc.rows.map(row => (
          <motion.div
            key={row.risk}
            variants={itemVariants}
            className='grid grid-cols-2 gap-3 border-t px-3 py-2.5 text-sm'
          >
            <span className='font-medium'>{row.risk}</span>
            <span className='text-muted-foreground'>{row.mitigation}</span>
          </motion.div>
        ))}
      </motion.div>
    )
  }

  if (doc.kind === 'steps') {
    return (
      <motion.ol variants={listVariants} initial='hidden' animate='visible' className='space-y-0'>
        {doc.items.map((item, index) => (
          <motion.li key={item} variants={itemVariants} className='flex gap-3'>
            <div className='flex flex-col items-center'>
              <motion.span
                variants={markVariants}
                className='bg-accent text-accent-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold'
              >
                {index + 1}
              </motion.span>
              {index < doc.items.length - 1 && <span className='bg-accent/40 w-px flex-1' />}
            </div>
            <p className='pb-4 text-sm font-medium'>{item}</p>
          </motion.li>
        ))}
      </motion.ol>
    )
  }

  return (
    <motion.ul variants={listVariants} initial='hidden' animate='visible' className='space-y-2.5'>
      {doc.items.map(item => (
        <motion.li key={item} variants={itemVariants} className='flex items-start gap-2.5'>
          <motion.span
            variants={markVariants}
            className='bg-accent text-accent-foreground mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full'
          >
            <CheckIcon className='size-3' />
          </motion.span>
          <span className='text-sm font-medium'>{item}</span>
        </motion.li>
      ))}
    </motion.ul>
  )
}

const PlaybookPeek = ({ doc, onClose }: PlaybookPeekProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Portalled to <body> so a transformed ancestor can't trap the fixed overlay
  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={event => {
        // React events bubble through the portal to the folder card, which would toggle it
        event.stopPropagation()
        onClose()
      }}
      className='fixed inset-0 z-80 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm'
    >
      <motion.div
        role='dialog'
        aria-modal='true'
        aria-label={doc.title}
        initial={{ opacity: 0, y: 24, scale: 0.95, rotate: -2 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
        exit={{ opacity: 0, y: 24, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        onClick={event => event.stopPropagation()}
        className='bg-card text-card-foreground w-full max-w-md space-y-5 rounded-3xl border p-6 shadow-2xl'
      >
        <div className='flex items-start justify-between gap-4'>
          <div className='space-y-1'>
            <p className='text-accent text-xs font-medium tracking-wide uppercase'>Used at {doc.usedAt}</p>
            <h3 className='text-2xl font-semibold'>{doc.title}</h3>
          </div>
          <Button
            variant='outline'
            size='icon-sm'
            aria-label='Close'
            autoFocus
            onClick={onClose}
            data-cursor='pointer'
            className='shrink-0 rounded-full'
          >
            <XIcon className='size-4' />
          </Button>
        </div>

        <p className='text-muted-foreground text-sm'>{doc.summary}</p>

        <PeekBody doc={doc} />

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className='rounded-lg bg-(--background-darker) px-3 py-2.5 text-sm font-medium'
        >
          <span className='text-accent'>Result: </span>
          {doc.result}
        </motion.p>
      </motion.div>
    </motion.div>,
    document.body
  )
}

export default PlaybookPeek
