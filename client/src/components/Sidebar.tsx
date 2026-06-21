import { aiProfileApi } from '../services/api'

interface SidebarProps {
  tone: string
  onToneChange: (tone: string) => void
  onLogout: () => void
}

export function Sidebar({ tone, onToneChange, onLogout }: SidebarProps) {
  return (
    <aside className="bg-[#1f2933] text-[#f8faf8] flex flex-col gap-7 lg:p-7 md:p-5 p-4 lg:sticky lg:top-0 lg:h-screen h-auto" aria-label="Companion navigation">
      <div>
        <p className="text-[#14b8a6] text-xs font-bold uppercase tracking-normal">Mental Companion</p>
        <h1 className="text-[40px] leading-[1.05] font-bold mt-1.5">Today</h1>
      </div>

      <nav className="grid gap-2" aria-label="Primary">
        <a href="#chat" aria-label="Open companion chat" className="items-center border border-white/12 rounded-lg text-[#f8faf8] flex gap-2.5 min-h-[44px] p-2.5 no-underline hover:bg-white/8">
          <span className="items-center bg-white/10 rounded-lg inline-flex h-7.5 justify-center w-7.5" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="h-[18px] stroke-current stroke-linecap-round stroke-linejoin-round stroke-[1.8] fill-none w-[18px]">
              <path d="M5 6h14v9H8l-3 3z" />
            </svg>
          </span>
          Chat
        </a>
        <a href="#mood" aria-label="Open mood tracker" className="items-center border border-white/12 rounded-lg text-[#f8faf8] flex gap-2.5 min-h-[44px] p-2.5 no-underline hover:bg-white/8">
          <span className="items-center bg-white/10 rounded-lg inline-flex h-[30px] justify-center w-[30px]" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="h-[18px] stroke-current stroke-linecap-round stroke-linejoin-round stroke-[1.8] fill-none w-[18px]">
              <path d="M12 4v16M4 14l4-4 4 4 4-6 4 4" />
            </svg>
          </span>
          Mood
        </a>
        <a href="#journal" aria-label="Open journal" className="items-center border border-white/12 rounded-lg text-[#f8faf8] flex gap-2.5 min-h-[44px] p-2.5 no-underline hover:bg-white/8">
          <span className="items-center bg-white/10 rounded-lg inline-flex h-[30px] justify-center w-[30px]" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="h-[18px] stroke-current stroke-linecap-round stroke-linejoin-round stroke-[1.8] fill-none w-[18px]">
              <path d="M6 4h11l1 1v15H6zM9 8h6M9 12h6M9 16h4" />
            </svg>
          </span>
          Journal
        </a>
      </nav>

      <section className="border-t border-white/14 grid gap-2.5 mt-auto pt-5" aria-labelledby="profile-title">
        <h2 id="profile-title" className="text-white text-lg">AI profile</h2>
        <label htmlFor="tone" className="text-[#cbd5d1]">Tone</label>
        <select id="tone" value={tone} onChange={async (event) => {
          const newTone = event.target.value
          onToneChange(newTone)
          try {
            await aiProfileApi.update({ tone: newTone })
          } catch (error) {
            console.error('Failed to update AI profile:', error)
          }
        }} className="bg-[#121820] border border-white/18 rounded-lg text-white min-h-[42px] p-2 w-full">
          <option>Warm and steady</option>
          <option>Direct and practical</option>
          <option>Reflective therapist-like</option>
        </select>
        <p className="text-[#cbd5d1]">{tone}</p>
        <button onClick={onLogout} className="bg-white/10 border border-white/18 rounded-lg text-white cursor-pointer text-sm font-semibold p-2 mt-2.5 hover:bg-white/20 transition-colors">
          Logout
        </button>
      </section>
    </aside>
  )
}
