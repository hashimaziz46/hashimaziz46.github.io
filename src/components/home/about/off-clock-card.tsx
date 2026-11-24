import { Card } from '@/components/ui/card'
import OffClockScene from '@/components/home/about/off-clock-scene'
import PlayerCard from '@/components/home/about/player-card'

// Hobbies in one card: the clickable camp scene on top, the character sheet underneath
const OffClockCard = () => (
  <Card className='ring-border gap-0 overflow-hidden rounded-[24px] bg-(--background-darker) p-0 shadow-none md:col-span-2'>
    <OffClockScene />
    <div className='p-5 sm:p-6'>
      <PlayerCard />
    </div>
  </Card>
)

export default OffClockCard
