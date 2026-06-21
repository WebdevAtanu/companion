interface MoodAnalyticsProps {
  moodSummary: { mood: string; count: number }[]
}

export function MoodAnalytics({ moodSummary }: MoodAnalyticsProps) {
  return (
    <article id="mood" className="bg-white border border-[#d9ded8] rounded-lg shadow-[0_18px_50px_rgba(31,41,51,0.08)] p-5" aria-labelledby="mood-title">
      <div className="items-start flex gap-3 justify-between mb-[18px]">
        <div>
          <p className="text-[#14b8a6] text-xs font-bold uppercase tracking-normal">Mood analytics</p>
          <h2 id="mood-title" className="text-[#1f2933] text-[22px] leading-[1.2] mt-0.5">Pattern</h2>
        </div>
      </div>
      <div className="grid gap-[14px]">
        {moodSummary.map((item) => (
          <div className="items-center grid gap-2.5 lg:grid-cols-[72px_1fr_24px] md:grid-cols-[64px_1fr_20px] grid-cols-[72px_1fr_24px] capitalize" key={item.mood}>
            <span>{item.mood}</span>
            <div className="bg-[#edf0ed] rounded-full h-[10px] overflow-hidden">
              <span className="bg-[#197c72] rounded-full block h-full max-w-full" style={{ width: `${Math.max(12, item.count * 22)}%` }} />
            </div>
            <strong>{item.count}</strong>
          </div>
        ))}
      </div>
    </article>
  )
}
