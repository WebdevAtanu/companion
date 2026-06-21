import type { FormEvent } from 'react'
import type { Mood } from '../services/api'

interface JournalFormProps {
  title: string
  content: string
  mood: Mood
  moodOptions: Mood[]
  onTitleChange: (title: string) => void
  onContentChange: (content: string) => void
  onMoodChange: (mood: Mood) => void
  onSubmit: (event: FormEvent) => void
}

export function JournalForm({ title, content, mood, moodOptions, onTitleChange, onContentChange, onMoodChange, onSubmit }: JournalFormProps) {
  return (
    <article className="bg-white border border-[#d9ded8] rounded-lg shadow-[0_18px_50px_rgba(31,41,51,0.08)] lg:p-5 md:p-4 p-3">
      <div className="items-start flex gap-3 justify-between mb-[18px]">
        <div>
          <p className="text-[#14b8a6] text-xs font-bold uppercase tracking-normal">Journal</p>
          <h2 className="text-[#1f2933] text-[22px] leading-[1.2] mt-0.5">New reflection</h2>
        </div>
      </div>
      <form onSubmit={onSubmit} className="grid gap-2.5">
        <input
          aria-label="Journal title"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="Title"
          className="bg-[#fbfcfb] border border-[#d9ded8] rounded-lg text-[#1f2933] min-w-0 p-2.5"
        />
        <textarea
          aria-label="Journal content"
          value={content}
          onChange={(event) => onContentChange(event.target.value)}
          placeholder="What happened, what helped, what needs care?"
          rows={5}
          className="bg-[#fbfcfb] border border-[#d9ded8] rounded-lg text-[#1f2933] min-w-0 p-2.5 resize-y"
        />
        <div className="items-center flex gap-2.5 justify-between md:flex-col md:items-stretch">
          <select
            aria-label="Journal mood"
            value={mood}
            onChange={(event) => onMoodChange(event.target.value as Mood)}
            className="bg-[#fbfcfb] border border-[#d9ded8] rounded-lg text-[#1f2933] min-w-0 p-2.5 min-h-[42px] md:justify-center md:w-full"
          >
            {moodOptions.map((mood) => (
              <option key={mood}>{mood}</option>
            ))}
          </select>
          <button type="submit" className="items-center bg-[#197c72] border-0 rounded-lg text-white inline-flex font-bold gap-2 min-h-[42px] p-2 md:justify-center md:w-full">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="fill-none h-[18px] stroke-current stroke-linecap-round stroke-linejoin-round stroke-2 w-[18px]">
              <path d="M5 12h14M12 5v14" />
            </svg>
            Save
          </button>
        </div>
      </form>
    </article>
  )
}
