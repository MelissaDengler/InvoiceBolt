import { StatCard } from './StatCard'
import type { Stat } from '@/types/stats'

interface StatGridProps {
  stats: Stat[]
}

export function StatGrid({ stats }: StatGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          {...stat}
          className="transition-all duration-300 hover:scale-105 hover:shadow-xl"
        />
      ))}
    </div>
  )
} 