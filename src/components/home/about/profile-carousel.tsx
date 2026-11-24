import { useEffect, useState } from 'react'

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

const IMAGES = [
  {
    src: '/images/hashim/carousel-graduation.webp',
    alt: 'Hashim Aziz at graduation, wearing his gold medal',
    caption: 'Gold Medalist · BS Software Engineering'
  }

  // Hidden for now; add it back to show the slideshow controls again
  // { src: '/images/hashim/carousel-portrait.webp', alt: 'Portrait of Hashim Aziz', caption: 'Islamabad, Pakistan' }
]

const HAS_SLIDES = IMAGES.length > 1

const AUTO_ADVANCE_MS = 3000

const ProfileCarousel = () => {
  const [index, setIndex] = useState(0)

  const goPrev = () => setIndex(prev => (prev - 1 + IMAGES.length) % IMAGES.length)
  const goNext = () => setIndex(prev => (prev + 1) % IMAGES.length)

  // Keyed on index so using the arrows restarts the countdown
  useEffect(() => {
    if (!HAS_SLIDES) return

    const timer = setTimeout(goNext, AUTO_ADVANCE_MS)

    return () => clearTimeout(timer)
  }, [index])

  return (
    <div className='relative h-112 overflow-hidden rounded-[24px] md:h-140'>
      {IMAGES.map(({ src, alt }, i) => (
        <img
          key={src}
          src={src}
          alt={alt}
          className={cn(
            'absolute inset-0 size-full object-cover transition-opacity duration-500',
            i === index ? 'opacity-100' : 'opacity-0'
          )}
        />
      ))}

      {/* Soft shade at the bottom so the caption reads on any photo */}
      <div className='pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/3 bg-linear-to-t from-black/65 to-transparent' />

      {IMAGES.map(({ src, caption }, i) => (
        <p
          key={src}
          aria-hidden={i !== index}
          className={cn(
            'pointer-events-none absolute bottom-5 left-5 z-20 max-w-[75%] text-sm font-medium text-white transition-opacity duration-500 sm:left-6',
            i === index ? 'opacity-100' : 'opacity-0'
          )}
        >
          {caption}
        </p>
      ))}

      {HAS_SLIDES && (
        <>
          <div className='absolute right-5 bottom-6.5 z-20 flex gap-0.5 sm:right-6'>
            {IMAGES.map(({ src }, i) => (
              <span
                key={src}
                className={cn(
                  'block h-0.5 rounded-full bg-white transition-all duration-300',
                  i === index ? 'w-2.5 opacity-100' : 'w-2.5 opacity-50'
                )}
              />
            ))}
          </div>

          <button
            type='button'
            onClick={goPrev}
            aria-label='Previous image'
            className='group/prev absolute inset-y-0 left-0 flex w-1/4 items-center justify-start pl-3 outline-none'
          >
            <span className='absolute inset-0 bg-linear-to-r from-black/30 to-transparent mask-[linear-gradient(to_right,black,transparent)] opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover/prev:opacity-100' />
            <ChevronLeftIcon className='relative size-5 -translate-x-2 text-white opacity-50 transition-all duration-300 group-hover/prev:translate-x-0 group-hover/prev:opacity-100 [&-svg]:size-4' />
          </button>

          <button
            type='button'
            onClick={goNext}
            aria-label='Next image'
            className='group/next absolute inset-y-0 right-0 flex w-1/4 items-center justify-end pr-3 outline-none'
          >
            <span className='absolute inset-0 bg-linear-to-l from-black/30 to-transparent mask-[linear-gradient(to_left,black,transparent)] opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover/next:opacity-100' />
            <ChevronRightIcon className='relative size-5 translate-x-2 text-white opacity-50 transition-all duration-300 group-hover/next:translate-x-0 group-hover/next:opacity-100 [&-svg]:size-4' />
          </button>
        </>
      )}
    </div>
  )
}

export default ProfileCarousel
