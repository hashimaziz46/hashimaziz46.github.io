import { useEffect, useState } from 'react'

import { useReducedMotion } from 'motion/react'

import { PROFILE } from '@/consts'

// The first entry is what the server renders, so it stays the headline role without JavaScript
const ROLES = [PROFILE.role, 'Technical Delivery Lead', 'Global Project Manager', 'Engineer turned PM']

const TYPE_MS = 55
const DELETE_MS = 28
const HOLD_MS = 1900
const GAP_MS = 350

const RoleTicker = () => {
  const shouldReduceMotion = useReducedMotion()
  const [roleIndex, setRoleIndex] = useState(0)
  const [length, setLength] = useState(ROLES[0].length)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (shouldReduceMotion) return

    const role = ROLES[roleIndex]
    let delay = deleting ? DELETE_MS : TYPE_MS
    let step = () => setLength(length + (deleting ? -1 : 1))

    if (!deleting && length === role.length) {
      delay = HOLD_MS
      step = () => setDeleting(true)
    } else if (deleting && length === 0) {
      delay = GAP_MS

      step = () => {
        setDeleting(false)
        setRoleIndex((roleIndex + 1) % ROLES.length)
      }
    }

    const timer = setTimeout(step, delay)

    return () => clearTimeout(timer)
  }, [deleting, length, roleIndex, shouldReduceMotion])

  return (
    <>
      <span className='sr-only'>{PROFILE.role}</span>
      <span aria-hidden='true'>
        {/* Zero-width space keeps the line height while the text is fully deleted */}
        {'​'}
        {ROLES[roleIndex].slice(0, length)}
        <span className='bg-accent ml-1 inline-block h-[0.9em] w-0.5 translate-y-[0.1em] animate-pulse motion-reduce:hidden' />
      </span>
    </>
  )
}

export default RoleTicker
