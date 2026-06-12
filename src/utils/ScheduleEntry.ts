import type Teacher from './Teacher.ts'
import type Room from './Room.ts'

export default interface ScheduleEntry {
  title: string
  intervenants: Teacher[],
  salles: Room[]
}