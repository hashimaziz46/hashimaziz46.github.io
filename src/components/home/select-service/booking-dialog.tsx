import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'

import { ExternalLinkIcon, LoaderCircleIcon, XIcon } from 'lucide-react'

import { Button, buttonVariants } from '@/components/ui/button'

type BookingDialogProps = {
  open: boolean
  onClose: () => void
  title: string
  url: string
}

// Google's booking page asks for `gv=true` when it is shown inside another site
export const toEmbedUrl = (url: string) => {
  const embed = new URL(url)

  embed.searchParams.set('gv', 'true')

  return embed.toString()
}

// The same page without `gv`, for opening on Google itself
const toPageUrl = (url: string) => {
  const page = new URL(url)

  page.searchParams.delete('gv')

  return page.toString()
}

// Pop-up holding the Google Calendar booking page for one service
const BookingDialog = ({ open, onClose, title, url }: BookingDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) return

    if (open && !dialog.open) {
      setLoaded(false)
      dialog.showModal()
      document.documentElement.style.overflow = 'hidden'
    } else if (!open && dialog.open) {
      dialog.close()
    }

    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [open])

  // Clicking the dimmed area outside the panel closes it
  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label={`Book a ${title}`}
      onClose={onClose}
      onClick={handleBackdropClick}
      className='bg-card text-foreground m-auto h-[92dvh] max-h-none w-[calc(100%-1rem)] max-w-3xl overflow-hidden rounded-3xl p-0 shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm sm:h-[85dvh] sm:w-[calc(100%-3rem)]'
    >
      {open && (
        <div className='flex h-full flex-col'>
          <div className='flex items-center justify-between gap-3 border-b px-5 py-3.5'>
            <div className='min-w-0'>
              <p className='truncate font-semibold'>{title}</p>
              <p className='text-muted-foreground text-xs'>Google Meet · times shown in your time zone</p>
            </div>

            <div className='flex shrink-0 items-center gap-1'>
              <a
                href={toPageUrl(url)}
                target='_blank'
                rel='noopener noreferrer'
                className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'text-muted-foreground gap-1.5' })}
              >
                <ExternalLinkIcon className='size-4' />
                <span className='hidden sm:inline'>New tab</span>
              </a>
              <Button variant='ghost' size='icon' aria-label='Close' onClick={onClose}>
                <XIcon className='size-5' />
              </Button>
            </div>
          </div>

          <div className='relative flex-1 bg-white'>
            {!loaded && (
              <div className='text-muted-foreground absolute inset-0 flex flex-col items-center justify-center gap-3 text-sm'>
                <LoaderCircleIcon className='text-accent size-7 animate-spin' />
                Loading available times...
              </div>
            )}
            <iframe
              src={toEmbedUrl(url)}
              title={`Available times for a ${title}`}
              onLoad={() => setLoaded(true)}
              className='size-full border-0'
            />
          </div>
        </div>
      )}
    </dialog>
  )
}

export default BookingDialog
