import type { FormEvent } from 'react'
import type { Message, Mood } from '../services/api'

interface ChatProps {
  messages: Message[]
  messageDraft: string
  selectedMood: Mood
  moodOptions: Mood[]
  onMessageChange: (message: string) => void
  onMoodChange: (mood: Mood) => void
  onSend: (event: FormEvent) => void
}

export function Chat({ messages, messageDraft, selectedMood, moodOptions, onMessageChange, onMoodChange, onSend }: ChatProps) {
  return (
    <article id="chat" className="bg-white border border-[#d9ded8] rounded-lg shadow-[0_18px_50px_rgba(31,41,51,0.08)] lg:p-5 md:p-4 p-3 grid grid-rows-[auto_minmax(360px,1fr)_auto] lg:min-h-172.5 md:min-h-155" aria-labelledby="chat-title">
      <div className="items-start flex gap-3 justify-between mb-4.5">
        <div>
          <p className="text-[#14b8a6] text-xs font-bold uppercase tracking-normal">AI companion</p>
          <h2 id="chat-title" className="text-[#1f2933] text-[22px] leading-[1.2] mt-0.5">Conversation</h2>
        </div>
        <span className={`rounded-full inline-flex text-xs font-bold leading-none p-[7px_9px] capitalize whitespace-nowrap ${selectedMood === 'calm' ? 'bg-[#d8ece8] text-[#16675f]' : selectedMood === 'hopeful' ? 'bg-[#f4ead1] text-[#92712b]' : selectedMood === 'low' ? 'bg-[#e9e5f0] text-[#65517d]' : selectedMood === 'anxious' ? 'bg-[#e2ebf8] text-[#315f9b]' : 'bg-[#f5dfd8] text-[#bb5b46]'}`}>{selectedMood}</span>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto pr-1" aria-live="polite">
        {messages?.map((message) => (
          <div className={`border border-[#d9ded8] rounded-lg lg:max-w-[78%] max-w-full p-3 ${message.sender === 'ai' ? 'bg-[#eef5f1] self-start' : 'bg-[#e2ebf8] border-[#c9d8ee] self-end'}`} key={message.id}>
            <span className="text-[#6a7280] block text-xs font-bold">{message.sender === 'ai' ? 'Companion' : 'You'}</span>
            <p className="m-1 my-1.5">{message.text}</p>
            <small className="text-[#6a7280] block text-xs font-bold">{message.time}</small>
          </div>
        ))}
      </div>

      <form className="border-t border-[#d9ded8] grid gap-2.5 mt-4.5 pt-4.5" onSubmit={onSend}>
        <label htmlFor="message" className="text-[#6a7280] text-xs font-bold">Message</label>
        <textarea
          id="message"
          value={messageDraft}
          onChange={(event) => onMessageChange(event.target.value)}
          placeholder="Share what is on your mind..."
          rows={3}
          className="bg-[#fbfcfb] border border-[#d9ded8] rounded-lg text-[#1f2933] min-w-0 p-2.5 resize-y"
        />
        <div className="items-center flex gap-2.5 justify-between md:flex-col md:items-stretch">
          <select
            aria-label="Current mood"
            value={selectedMood}
            onChange={(event) => onMoodChange(event.target.value as Mood)}
            className="bg-[#fbfcfb] border border-[#d9ded8] rounded-lg text-[#1f2933] min-w-0 p-2.5 min-h-10.5 md:justify-center md:w-full"
          >
            {moodOptions.map((mood) => (
              <option key={mood}>{mood}</option>
            ))}
          </select>
          <button type="submit" className="items-center bg-[#197c72] border-0 rounded-lg text-white inline-flex font-bold gap-2 min-h-10.5 p-2 md:justify-center md:w-full">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="fill-none h-[18px] stroke-current stroke-linecap-round stroke-linejoin-round stroke-2 w-4.5">
              <path d="M4 12h15M13 6l6 6-6 6" />
            </svg>
            Send
          </button>
        </div>
      </form>
    </article>
  )
}
