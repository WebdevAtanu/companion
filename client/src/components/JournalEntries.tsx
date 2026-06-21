import type { JournalEntry } from '../services/api'

interface JournalEntriesProps {
  journalEntries: JournalEntry[]
}

export function JournalEntries({ journalEntries }: JournalEntriesProps) {
  return (
    <article className="bg-white border border-[#d9ded8] rounded-lg shadow-[0_18px_50px_rgba(31,41,51,0.08)] lg:p-5 md:p-4 p-3 min-h-[360px]">
      <div className="items-start flex gap-3 justify-between mb-[18px]">
        <div>
          <p className="text-[#14b8a6] text-xs font-bold uppercase tracking-normal">Conversation history</p>
          <h2 className="text-[#1f2933] text-[22px] leading-[1.2] mt-0.5">Memory</h2>
        </div>
      </div>
      <div className="grid gap-3">
        {journalEntries.map((entry) => (
          <section className="border border-[#d9ded8] rounded-lg grid gap-2 p-3.5" key={entry.id}>
            <div className="items-center flex gap-2.5 justify-between">
              <h3 className="text-[17px]">{entry.title}</h3>
              <span className={`rounded-full inline-flex text-xs font-bold leading-none p-[7px_9px] capitalize whitespace-nowrap ${entry.mood === 'calm' ? 'bg-[#d8ece8] text-[#16675f]' : entry.mood === 'hopeful' ? 'bg-[#f4ead1] text-[#92712b]' : entry.mood === 'low' ? 'bg-[#e9e5f0] text-[#65517d]' : entry.mood === 'anxious' ? 'bg-[#e2ebf8] text-[#315f9b]' : 'bg-[#f5dfd8] text-[#bb5b46]'}`}>{entry.mood}</span>
            </div>
            <p className="text-[#6a7280]">{entry.content}</p>
            <small className="text-[#6a7280]">{new Date(entry.createdAt).toLocaleString()}</small>
          </section>
        ))}
      </div>
    </article>
  )
}
