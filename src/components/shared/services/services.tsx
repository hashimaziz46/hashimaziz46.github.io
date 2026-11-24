import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'

import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { MinusIcon, PlusIcon } from 'lucide-react'

import Eyebrow from '@/components/shared/eyebrow/eyebrow'
import ServicePreview, { type ServicePreviewData } from '@/components/shared/services/service-preview'
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from '@/components/ui/accordion'

const SERVICES = [
  {
    title: 'Agile Project Delivery',
    preview: {
      kind: 'bars',
      label: 'Sprint efficiency',
      stat: '+21%',
      caption: 'With development velocity up 17%',
      source: 'GitStart'
    } satisfies ServicePreviewData,
    duration: 'Full engagement',
    tools: ['Scrum', 'JIRA', 'Sprint planning'],
    description:
      'I run delivery end to end - backlog, roadmap and sprints - so timelines stay predictable and teams stay aligned with business goals.'
  },
  {
    title: 'Requirements & Solution Design',
    preview: {
      kind: 'roadmap',
      label: 'Project revenue scoped',
      stat: '$500K+',
      caption: 'From solution design workshops to Agile roadmaps',
      source: 'Geeks Ltd'
    } satisfies ServicePreviewData,
    duration: '1 to 3 weeks',
    tools: ['Workshops', 'Specs', 'Estimation'],
    description:
      'I lead solution design workshops and turn business needs into clear specs with accurate cost and time estimates.'
  },
  {
    title: 'Delivery Governance & QA',
    preview: {
      kind: 'gauge',
      label: 'Average CSAT',
      stat: '80%+',
      caption: 'Across 18 concurrent projects',
      source: 'Geeks Ltd'
    } satisfies ServicePreviewData,
    duration: 'Ongoing',
    tools: ['Risk registers', 'QA frameworks', 'Dashboards'],
    description:
      'I set up governance, risk tracking and QA processes that cut defects and give stakeholders real visibility across projects.'
  },
  {
    title: 'Compliance & Audits',
    preview: {
      kind: 'checklist',
      label: 'Audit delays',
      stat: 'Zero',
      caption: 'SOX audits and vendor risk assessments, all on time',
      source: 'CareCloud'
    } satisfies ServicePreviewData,
    duration: 'Per audit cycle',
    tools: ['SOX', 'Vendor risk', 'Documentation'],
    description:
      'I coordinate SOX audits and vendor risk assessments so compliance work lands on time without stalling delivery.'
  },
  {
    title: 'AI & Process Automation',
    preview: {
      kind: 'drop',
      label: 'Document review time',
      stat: '2 hrs → 15 min',
      caption: 'AI document processing across 145 land authorities',
      source: 'Search Acumen'
    } satisfies ServicePreviewData,
    duration: '1 to 6 months',
    tools: ['LLMs', 'OCR', 'Workflow automation'],
    description:
      'I lead automation programmes - from AI document processing to invoice generation - that remove manual bottlenecks.'
  }
]

const Services = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [displayedIndex, setDisplayedIndex] = useState<number | null>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30, mass: 0.5 })
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30, mass: 0.5 })

  const offsetX = useTransform(springX, value => `calc(${value}px - 50%)`)
  const offsetY = useTransform(springY, value => `calc(${value}px - 50%)`)

  const rawTilt = useMotionValue(-8)
  const tilt = useSpring(rawTilt, { stiffness: 300, damping: 20 })

  useEffect(() => {
    rawTilt.set(hoveredIndex !== null && hoveredIndex % 2 === 1 ? 8 : -8)
  }, [hoveredIndex, rawTilt])

  const handleServiceMouseEnter = (index: number) => {
    setHoveredIndex(index)
    setDisplayedIndex(index)
  }

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()

    mouseX.set(event.clientX - bounds.left)
    mouseY.set(event.clientY - bounds.top)
  }

  const handleContainerMouseEnter = () => {
    if (!containerRef.current) return

    containerRef.current.style.setProperty('cursor', 'none', 'important')
    containerRef.current
      .querySelectorAll('button')
      .forEach(button => button.style.setProperty('cursor', 'none', 'important'))
  }

  const handleContainerMouseLeave = () => {
    if (containerRef.current) {
      containerRef.current.style.removeProperty('cursor')
      containerRef.current.querySelectorAll('button').forEach(button => button.style.removeProperty('cursor'))
    }

    setHoveredIndex(null)
  }

  return (
    <section id='services' className='border-b py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:space-y-16 lg:px-10.5'>
        <div className='space-y-2'>
          <Eyebrow>Services I provide</Eyebrow>
          <h2 className='text-2xl font-semibold md:text-3xl lg:text-4xl'>How I can help your team</h2>
        </div>

        <div
          ref={containerRef}
          className='relative mx-auto'
          onMouseMove={handleMouseMove}
          onMouseEnter={handleContainerMouseEnter}
          onMouseLeave={handleContainerMouseLeave}
        >
          <Accordion className='divide-y'>
            {SERVICES.map((service, index) => (
              <AccordionItem key={service.title} value={index} onMouseEnter={() => handleServiceMouseEnter(index)}>
                <AccordionTrigger className='text-primary items-center border-0 py-4 text-lg hover:no-underline **:data-[slot=accordion-trigger-icon]:hidden sm:text-xl lg:text-[26px]'>
                  <span>
                    {index + 1}. {service.title}
                  </span>
                  <span className='bg-card relative flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full'>
                    <PlusIcon className='text-accent size-4 rotate-0 opacity-100 transition-all duration-300 group-aria-expanded/accordion-trigger:rotate-90 group-aria-expanded/accordion-trigger:opacity-0' />
                    <MinusIcon className='text-accent absolute size-4 -rotate-90 opacity-0 transition-all duration-300 group-aria-expanded/accordion-trigger:rotate-0 group-aria-expanded/accordion-trigger:opacity-100' />
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className='mt-2 space-y-4'>
                    <p className='text-sm font-medium tracking-wide uppercase'>{service.duration}</p>
                    <p className='mb-1 flex flex-wrap items-center gap-3 text-sm font-medium tracking-wide uppercase'>
                      {service.tools.map((tool, toolIndex) => (
                        <span key={tool} className='flex items-center gap-2'>
                          {tool}
                          {toolIndex < service.tools.length - 1 && <span className='text-accent'>✦</span>}
                        </span>
                      ))}
                    </p>
                    <p className='text-muted-foreground text-base'>{service.description}</p>

                    {/* No hover on small screens, so the result card sits inside the open panel */}
                    <ServicePreview
                      preview={service.preview}
                      className='bg-card max-w-64 rounded-xl border p-3 sm:hidden'
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <motion.div
            style={{ x: offsetX, y: offsetY, rotate: tilt, opacity: hoveredIndex === null ? 0 : 1 }}
            className='pointer-events-none absolute top-0 left-0 z-10 hidden w-56 rounded-xl border bg-white p-3.5 shadow-xl transition-opacity duration-200 sm:block dark:border-neutral-700 dark:bg-neutral-900'
          >
            {displayedIndex !== null && (
              <motion.div
                key={displayedIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <ServicePreview preview={SERVICES[displayedIndex].preview} />
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Services
