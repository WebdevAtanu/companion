import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type Mood = 'calm' | 'hopeful' | 'low' | 'anxious' | 'stressed'
type Sender = 'user' | 'ai'

type Message = {
  id: number
  sender: Sender
  text: string
  tag?: Mood
  time: string
}

type JournalEntry = {
  id: number
  title: string
  content: string
  mood: Mood
  time: string
}

type Reminder = {
  id: number
  title: string
  time: string
  done: boolean
}

const moodOptions: Mood[] = ['calm', 'hopeful', 'low', 'anxious', 'stressed']

const starterMessages: Message[] = [
  {
    id: 1,
    sender: 'ai',
    text: 'I am here with you. What feels most present right now?',
    tag: 'calm',
    time: '09:20',
  },
  {
    id: 2,
    sender: 'user',
    text: 'I have a lot to do and my head feels crowded.',
    tag: 'stressed',
    time: '09:22',
  },
  {
    id: 3,
    sender: 'ai',
    text: 'Let us name the load first, then choose one small next step. What is the heaviest item on the list?',
    tag: 'stressed',
    time: '09:22',
  },
]

const initialJournal: JournalEntry[] = [
  {
    id: 1,
    title: 'Morning check-in',
    content: 'Slept lightly, but a walk helped me feel steadier.',
    mood: 'hopeful',
    time: 'Today',
  },
  {
    id: 2,
    title: 'After work',
    content: 'Felt tense after calls. Need a shorter evening routine.',
    mood: 'stressed',
    time: 'Yesterday',
  },
]

const initialReminders: Reminder[] = [
  { id: 1, title: 'Breathe for two minutes', time: '10:30', done: false },
  { id: 2, title: 'Journal after dinner', time: '20:00', done: false },
  { id: 3, title: 'Message support contact', time: 'Friday', done: true },
]

function App() {
  const [messages, setMessages] = useState<Message[]>(starterMessages)
  const [messageDraft, setMessageDraft] = useState('')
  const [selectedMood, setSelectedMood] = useState<Mood>('calm')
  const [journalTitle, setJournalTitle] = useState('')
  const [journalContent, setJournalContent] = useState('')
  const [journalMood, setJournalMood] = useState<Mood>('hopeful')
  const [journalEntries, setJournalEntries] = useState(initialJournal)
  const [reminders, setReminders] = useState(initialReminders)
  const [tone, setTone] = useState('Warm and steady')

  const moodSummary = useMemo(() => {
    const totals = moodOptions.map((mood) => ({
      mood,
      count:
        messages.filter((message) => message.tag === mood).length +
        journalEntries.filter((entry) => entry.mood === mood).length,
    }))

    return totals.sort((a, b) => b.count - a.count)
  }, [messages, journalEntries])

  const nextMessageId = () => Date.now()

  const detectMood = (text: string): Mood => {
    const lower = text.toLowerCase()
    if (/(panic|anxious|worry|scared|fear)/.test(lower)) return 'anxious'
    if (/(stress|tired|overwhelm|crowded|pressure)/.test(lower)) return 'stressed'
    if (/(sad|low|empty|heavy|alone)/.test(lower)) return 'low'
    if (/(better|grateful|hope|okay|good)/.test(lower)) return 'hopeful'
    return selectedMood
  }

  const buildReply = (mood: Mood, text: string) => {
    const prompt = text.trim().split(/[.!?]/)[0]
    const replies: Record<Mood, string> = {
      calm: `That sounds worth holding gently. Let us keep it simple: what would support you for the next 10 minutes?`,
      hopeful: `I hear some forward motion there. We can protect that by choosing one concrete thing to do next.`,
      low: `I am sorry it feels heavy. You do not have to solve all of it at once. What is one kind thing your body needs right now?`,
      anxious: `Let us slow the pace. Name five things you can see, then we can come back to "${prompt}" with a steadier nervous system.`,
      stressed: `That is a lot to carry. Pick one thread from "${prompt}" and we will turn it into the smallest possible action.`,
    }

    return replies[mood]
  }

  const handleSend = (event: FormEvent) => {
    event.preventDefault()
    const text = messageDraft.trim()
    if (!text) return

    const tag = detectMood(text)
    const time = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })

    const userMessage: Message = {
      id: nextMessageId(),
      sender: 'user',
      text,
      tag,
      time,
    }

    const aiMessage: Message = {
      id: nextMessageId() + 1,
      sender: 'ai',
      text: buildReply(tag, text),
      tag,
      time,
    }

    setMessages((current) => [...current, userMessage, aiMessage])
    setSelectedMood(tag)
    setMessageDraft('')
  }

  const handleJournalSave = (event: FormEvent) => {
    event.preventDefault()
    if (!journalTitle.trim() || !journalContent.trim()) return

    setJournalEntries((current) => [
      {
        id: nextMessageId(),
        title: journalTitle.trim(),
        content: journalContent.trim(),
        mood: journalMood,
        time: 'Just now',
      },
      ...current,
    ])
    setJournalTitle('')
    setJournalContent('')
  }

  const toggleReminder = (id: number) => {
    setReminders((current) =>
      current.map((reminder) =>
        reminder.id === id ? { ...reminder, done: !reminder.done } : reminder,
      ),
    )
  }

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Companion navigation">
        <div>
          <p className="eyebrow">Mental Companion</p>
          <h1>Today</h1>
        </div>

        <nav className="nav-list" aria-label="Primary">
          <a href="#chat" aria-label="Open companion chat">
            <span className="nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M5 6h14v9H8l-3 3z" />
              </svg>
            </span>
            Chat
          </a>
          <a href="#mood" aria-label="Open mood tracker">
            <span className="nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 4v16M4 14l4-4 4 4 4-6 4 4" />
              </svg>
            </span>
            Mood
          </a>
          <a href="#journal" aria-label="Open journal">
            <span className="nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M6 4h11l1 1v15H6zM9 8h6M9 12h6M9 16h4" />
              </svg>
            </span>
            Journal
          </a>
        </nav>

        <section className="profile-panel" aria-labelledby="profile-title">
          <h2 id="profile-title">AI profile</h2>
          <label htmlFor="tone">Tone</label>
          <select id="tone" value={tone} onChange={(event) => setTone(event.target.value)}>
            <option>Warm and steady</option>
            <option>Direct and practical</option>
            <option>Reflective therapist-like</option>
          </select>
          <p>{tone}</p>
        </section>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Private companion workspace</p>
            <h2>Support, reflection, and gentle structure in one place.</h2>
          </div>
          <a className="emergency-link" href="tel:988">
            988 crisis support
          </a>
        </header>

        <section className="primary-grid">
          <article id="chat" className="panel chat-panel" aria-labelledby="chat-title">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">AI companion</p>
                <h2 id="chat-title">Conversation</h2>
              </div>
              <span className={`mood-badge ${selectedMood}`}>{selectedMood}</span>
            </div>

            <div className="messages" aria-live="polite">
              {messages.map((message) => (
                <div className={`message ${message.sender}`} key={message.id}>
                  <span>{message.sender === 'ai' ? 'Companion' : 'You'}</span>
                  <p>{message.text}</p>
                  <small>{message.time}</small>
                </div>
              ))}
            </div>

            <form className="composer" onSubmit={handleSend}>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                value={messageDraft}
                onChange={(event) => setMessageDraft(event.target.value)}
                placeholder="Share what is on your mind..."
                rows={3}
              />
              <div className="composer-actions">
                <select
                  aria-label="Current mood"
                  value={selectedMood}
                  onChange={(event) => setSelectedMood(event.target.value as Mood)}
                >
                  {moodOptions.map((mood) => (
                    <option key={mood}>{mood}</option>
                  ))}
                </select>
                <button type="submit">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 12h15M13 6l6 6-6 6" />
                  </svg>
                  Send
                </button>
              </div>
            </form>
          </article>

          <div className="side-stack">
            <article id="mood" className="panel" aria-labelledby="mood-title">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Mood analytics</p>
                  <h2 id="mood-title">Pattern</h2>
                </div>
              </div>
              <div className="mood-list">
                {moodSummary.map((item) => (
                  <div className="mood-row" key={item.mood}>
                    <span>{item.mood}</span>
                    <div className="meter">
                      <span style={{ width: `${Math.max(12, item.count * 22)}%` }} />
                    </div>
                    <strong>{item.count}</strong>
                  </div>
                ))}
              </div>
            </article>

            <article className="panel" aria-labelledby="reminders-title">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Reminders</p>
                  <h2 id="reminders-title">Care plan</h2>
                </div>
              </div>
              <ul className="reminder-list">
                {reminders.map((reminder) => (
                  <li key={reminder.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={reminder.done}
                        onChange={() => toggleReminder(reminder.id)}
                      />
                      <span>{reminder.title}</span>
                    </label>
                    <time>{reminder.time}</time>
                  </li>
                ))}
              </ul>
            </article>

            <article className="panel emergency-panel" aria-labelledby="contacts-title">
              <div>
                <p className="eyebrow">Emergency contacts</p>
                <h2 id="contacts-title">Support circle</h2>
              </div>
              <p>Priya - Sister</p>
              <a href="tel:+1555010149">Call +1 555 010 149</a>
            </article>
          </div>
        </section>

        <section id="journal" className="journal-grid" aria-label="Journal workspace">
          <article className="panel journal-editor">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Journal</p>
                <h2>New reflection</h2>
              </div>
            </div>
            <form onSubmit={handleJournalSave}>
              <input
                aria-label="Journal title"
                value={journalTitle}
                onChange={(event) => setJournalTitle(event.target.value)}
                placeholder="Title"
              />
              <textarea
                aria-label="Journal content"
                value={journalContent}
                onChange={(event) => setJournalContent(event.target.value)}
                placeholder="What happened, what helped, what needs care?"
                rows={5}
              />
              <div className="composer-actions">
                <select
                  aria-label="Journal mood"
                  value={journalMood}
                  onChange={(event) => setJournalMood(event.target.value as Mood)}
                >
                  {moodOptions.map((mood) => (
                    <option key={mood}>{mood}</option>
                  ))}
                </select>
                <button type="submit">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14M12 5v14" />
                  </svg>
                  Save
                </button>
              </div>
            </form>
          </article>

          <article className="panel history-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Conversation history</p>
                <h2>Memory</h2>
              </div>
            </div>
            <div className="entry-list">
              {journalEntries.map((entry) => (
                <section className="entry" key={entry.id}>
                  <div>
                    <h3>{entry.title}</h3>
                    <span className={`mood-badge ${entry.mood}`}>{entry.mood}</span>
                  </div>
                  <p>{entry.content}</p>
                  <small>{entry.time}</small>
                </section>
              ))}
            </div>
          </article>
        </section>
      </section>
    </main>
  )
}

export default App
