import { useState } from 'react'

import { CalendarClockIcon, MailIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { GOOGLE_BOOKING_PAGE, PROFILE } from '@/consts'
import { cn } from '@/lib/utils'
import BookingDialog from '@/components/home/select-service/booking-dialog'

const SERVICES = [
  {
    id: 'intro-call',
    title: 'Intro Call',
    price: 'Free',
    duration: '60 min',
    description: 'Talk through a PM or Scrum Master role on your team'
  },
  {
    id: 'delivery-consultation',
    title: 'Delivery Consultation',
    price: 'Free',
    duration: '60 min',
    description: 'Review a project that is slipping, and plan how to recover it'
  },
  {
    id: 'agile-process-review',
    title: 'Agile Process Review',
    price: 'Free',
    duration: '60 min',
    description: 'Find the bottlenecks in your sprints, QA and reporting'
  }
]

type Service = (typeof SERVICES)[number]

// Only Google's own embed links can sit inside the pop-up; share links open in a new tab
const isEmbeddable = (url: string) => url.startsWith('https://calendar.google.com/calendar/appointments/schedules/')

const getMailtoUrl = (service: Service) => {
  const subject = `Booking a ${service.title} (${service.duration})`
  const body = `Hi ${PROFILE.firstName},\n\nI'd like to book a ${service.title}. A few times that suit me (with my time zone):\n\n- \n- \n\nThanks,\n`

  return `mailto:${PROFILE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

// Visitors pick a call here, then choose a real free slot on Google Calendar, which adds the Meet link
const ServiceStepCard = () => {
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const selectedService = SERVICES.find(service => service.id === selectedServiceId)
  const bookingUrl = GOOGLE_BOOKING_PAGE.trim()

  const handleBook = () => {
    if (!selectedService) return

    if (!bookingUrl) {
      window.location.href = getMailtoUrl(selectedService)
    } else if (isEmbeddable(bookingUrl)) {
      setDialogOpen(true)
    } else {
      window.open(bookingUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className='bg-card relative overflow-hidden rounded-3xl shadow-sm'>
      <div className='from-accent relative bg-linear-to-br to-red-600 px-6 pt-6 pb-12'>
        <div className='relative z-10 flex items-start justify-between gap-4'>
          <div>
            <p className='text-primary-foreground dark:text-primary text-xl font-semibold'>Book a Call</p>
            <p className='text-primary-foreground dark:text-primary text-sm'>Free · on Google Meet</p>
          </div>

          <CalendarClockIcon className='text-primary-foreground dark:text-primary size-7 opacity-80' />
        </div>
      </div>

      <div className='bg-card relative z-10 -mt-6 space-y-4 rounded-t-3xl p-6'>
        <p className='text-muted-foreground flex h-7 items-center text-sm'>
          Pick a call, then choose a time that suits you.
        </p>

        <ScrollArea className='h-83'>
          <div className='space-y-3'>
            {SERVICES.map(service => {
              const selected = selectedServiceId === service.id

              return (
                <Button
                  key={service.id}
                  variant='outline'
                  aria-pressed={selected}
                  onClick={() => setSelectedServiceId(service.id)}
                  className={cn(
                    'bg-card hover:bg-card h-auto w-full items-start justify-start gap-3 rounded-xl p-4 text-left whitespace-normal',
                    selected ? 'border-accent bg-(--background-darker) hover:bg-(--background-darker)' : 'border-border'
                  )}
                >
                  <span
                    className={cn(
                      'mt-2 size-2.5 shrink-0 rounded-full',
                      selected ? 'bg-accent' : 'bg-muted-foreground'
                    )}
                  />
                  <span className='flex-1 space-y-1'>
                    <span className='flex items-center justify-between gap-2'>
                      <span className='text-base font-semibold'>{service.title}</span>
                      <span className={cn('text-card-foreground font-semibold', selected && 'text-accent')}>
                        {service.price}
                      </span>
                    </span>
                    <span className='text-muted-foreground block text-xs'>{service.duration}</span>
                    <span className='text-muted-foreground block text-sm'>{service.description}</span>
                  </span>
                </Button>
              )
            })}
          </div>
        </ScrollArea>

        <div className='flex min-h-21 flex-col justify-center space-y-2'>
          <Button
            disabled={!selectedService}
            onClick={handleBook}
            className={cn(
              'bg-accent hover:bg-accent h-14 w-full gap-2 rounded-3xl text-base font-medium text-white',
              !selectedService && 'bg-muted/50 opacity-100'
            )}
          >
            {selectedService && !bookingUrl ? (
              <>
                <MailIcon className='size-5' />
                Email me to book
              </>
            ) : (
              <>
                <CalendarClockIcon className='size-5' />
                See available times
              </>
            )}
          </Button>
          <p className='text-muted-foreground text-center text-xs'>
            {selectedService && !bookingUrl
              ? "Suggest a few times and I'll send a Google Meet invite."
              : 'Book on Google Calendar. The Meet link arrives by email.'}
          </p>
        </div>
      </div>

      {selectedService && bookingUrl && (
        <BookingDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title={selectedService.title}
          url={bookingUrl}
        />
      )}
    </div>
  )
}

export default ServiceStepCard
