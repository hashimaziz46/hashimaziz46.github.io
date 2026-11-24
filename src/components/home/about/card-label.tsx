import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

// The small orange label in the top-left of every About card, so the cards read as one set
const CardLabel = ({ children, className }: { children: ReactNode; className?: string }) => (
  <p className={cn('text-accent font-mono text-xs tracking-wide uppercase', className)}>{children}</p>
)

export default CardLabel
