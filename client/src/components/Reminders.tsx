import type { Reminder } from '../services/api'

interface RemindersProps {
  reminders: Reminder[]
  onToggleReminder: (id: string) => void
}

export function Reminders({ reminders, onToggleReminder }: RemindersProps) {
  return (
    <article className="bg-white border border-[#d9ded8] rounded-lg shadow-[0_18px_50px_rgba(31,41,51,0.08)] p-5" aria-labelledby="reminders-title">
      <div className="items-start flex gap-3 justify-between mb-[18px]">
        <div>
          <p className="text-[#14b8a6] text-xs font-bold uppercase tracking-normal">Reminders</p>
          <h2 id="reminders-title" className="text-[#1f2933] text-[22px] leading-[1.2] mt-0.5">Care plan</h2>
        </div>
      </div>
      <ul className="grid gap-2.5 list-none m-0 p-0">
        {reminders.map((reminder) => (
          <li key={reminder.id} className="items-center border border-[#d9ded8] rounded-lg flex gap-3 justify-between min-h-[50px] p-2.5">
            <label className="items-center flex gap-2.5">
              <input
                type="checkbox"
                checked={reminder.isCompleted}
                onChange={() => onToggleReminder(reminder.id)}
                className="accent-[#197c72] h-[18px] w-[18px]"
              />
              <span>{reminder.title}</span>
            </label>
            <time className="text-[#6a7280] text-xs whitespace-nowrap">{new Date(reminder.remindAt).toLocaleString()}</time>
          </li>
        ))}
      </ul>
    </article>
  )
}
