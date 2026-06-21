import { useMemo, useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from './contexts/useAuth'
import { conversationsApi, journalsApi, remindersApi, aiProfileApi, emergencyContactsApi } from './services/api'
import type { Message, JournalEntry, Reminder, Mood } from './services/api'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { Chat } from './components/Chat'
import { MoodAnalytics } from './components/MoodAnalytics'
import { Reminders } from './components/Reminders'
import { EmergencyContacts } from './components/EmergencyContacts'
import { JournalForm } from './components/JournalForm'
import { JournalEntries } from './components/JournalEntries'
import { LoginForm } from './components/LoginForm'
import { RegisterForm } from './components/RegisterForm'


const moodOptions: Mood[] = ['calm', 'hopeful', 'low', 'anxious', 'stressed']

function App() {
  const { user, isLoading: authLoading, login, register, logout } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [messageDraft, setMessageDraft] = useState('')
  const [selectedMood, setSelectedMood] = useState<Mood>('calm')
  const [journalTitle, setJournalTitle] = useState('')
  const [journalContent, setJournalContent] = useState('')
  const [journalMood, setJournalMood] = useState<Mood>('hopeful')
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [tone, setTone] = useState('Warm and steady')
  const [emergencyContacts, setEmergencyContacts] = useState<{ name: string; phone: string; relation: string }[]>([])
  const [showLogin, setShowLogin] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerName, setRegisterName] = useState('')
  const [authError, setAuthError] = useState('')

  // Load data when user is authenticated
  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    try {
      const [conversationsRes, journalsRes, remindersRes, aiProfileRes, contactsRes] = await Promise.all([
        conversationsApi.list(),
        journalsApi.list(),
        remindersApi.list(),
        aiProfileApi.get(),
        emergencyContactsApi.list(),
      ])

      if (conversationsRes.success && conversationsRes.data && conversationsRes.data.length > 0) {
        const latestConv = conversationsRes.data[0]
        setMessages(latestConv.messages)
      } else {
        // Create initial conversation if none exists
        const newConv = await conversationsApi.create('Today')
        if (newConv.success && newConv.data) {
          setMessages(newConv.data.messages)
        }
      }

      if (journalsRes.success && journalsRes.data) {
        setJournalEntries(journalsRes.data)
      }

      if (remindersRes.success && remindersRes.data) {
        setReminders(remindersRes.data)
      }

      if (aiProfileRes.success && aiProfileRes.data) {
        setTone(aiProfileRes.data.tone)
      }

      if (contactsRes.success && contactsRes.data) {
        setEmergencyContacts(contactsRes.data)
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }

  const moodSummary = useMemo(() => {
    const totals = moodOptions.map((mood) => ({
      mood,
      count:
        messages?.filter((message) => message.tag === mood).length +
        journalEntries.filter((entry) => entry.mood === mood).length,
    }))

    return totals.sort((a, b) => b.count - a.count)
  }, [messages, journalEntries])

  const detectMood = (text: string): Mood => {
    const lower = text.toLowerCase()
    if (/(panic|anxious|worry|scared|fear)/.test(lower)) return 'anxious'
    if (/(stress|tired|overwhelm|crowded|pressure)/.test(lower)) return 'stressed'
    if (/(sad|low|empty|heavy|alone)/.test(lower)) return 'low'
    if (/(better|grateful|hope|okay|good)/.test(lower)) return 'hopeful'
    return selectedMood
  }

  const handleSend = async (event: FormEvent) => {
    event.preventDefault()
    const text = messageDraft.trim()
    if (!text || !user) return

    try {
      // Get or create conversation
      const conversationsRes = await conversationsApi.list()
      let conversationId: string

      if (conversationsRes.success && conversationsRes.data && conversationsRes.data.length > 0) {
        conversationId = conversationsRes.data[0].id
      } else {
        const newConv = await conversationsApi.create('Today')
        if (newConv.success && newConv.data) {
          conversationId = newConv.data.id
        } else {
          throw new Error('Failed to create conversation')
        }
      }

      const result = await conversationsApi.addMessage(conversationId, text)
      if (result.success && result.data) {
        setMessages(result.data.conversation.messages)
        setSelectedMood(detectMood(text))
        setMessageDraft('')
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleJournalSave = async (event: FormEvent) => {
    event.preventDefault()
    if (!journalTitle.trim() || !journalContent.trim() || !user) return

    try {
      const result = await journalsApi.create({
        title: journalTitle.trim(),
        content: journalContent.trim(),
        mood: journalMood,
      })
      if (result.success && result.data) {
        setJournalEntries((current) => [result.data!, ...current])
        setJournalTitle('')
        setJournalContent('')
      }
    } catch (error) {
      console.error('Failed to save journal:', error)
    }
  }

  const toggleReminder = async (id: string) => {
    const reminder = reminders.find((r) => r.id === id)
    if (!reminder || !user) return

    try {
      const result = await remindersApi.update(id, { isCompleted: !reminder.isCompleted })
      if (result.success && result.data) {
        setReminders((current) =>
          current.map((r) => (r.id === id ? result.data! : r)),
        )
      }
    } catch (error) {
      console.error('Failed to update reminder:', error)
    }
  }

  // Auth handlers
  const handleLogin = async (event: FormEvent) => {
    event.preventDefault()
    setAuthError('')
    try {
      await login(loginEmail, loginPassword)
      setShowLogin(false)
      setLoginEmail('')
      setLoginPassword('')
    } catch (error) {
      console.error('Login error:', error)
      setAuthError('Login failed. Please check your credentials.')
    }
  }

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault()
    setAuthError('')
    try {
      await register(registerEmail, registerPassword, registerName || undefined)
      setShowLogin(false)
      setRegisterEmail('')
      setRegisterPassword('')
      setRegisterName('')
    } catch (error) {
      console.error('Registration error:', error)
      setAuthError('Registration failed. Please try again.')
    }
  }

  if (authLoading) {
    return <div className="grid lg:grid-cols-[280px_minmax(0,1fr)] grid-cols-1 min-h-screen">Loading...</div>
  }

  if (!user) {
    return (
      <main className="grid grid-cols-1 min-h-screen">
        <div className="flex flex-col items-center justify-center min-h-screen lg:p-10 md:p-5 p-4 text-center">
          <h1 className="text-[48px] font-bold leading-tight mb-4">Mental Companion</h1>
          <p className="text-[#64748b] text-lg mb-10">Your private space for support, reflection, and gentle structure.</p>

          {showLogin ? (
            <LoginForm
              email={loginEmail}
              password={loginPassword}
              error={authError}
              onEmailChange={setLoginEmail}
              onPasswordChange={setLoginPassword}
              onSubmit={handleLogin}
              onBack={() => setShowLogin(false)}
            />
          ) : (
            <RegisterForm
              name={registerName}
              email={registerEmail}
              password={registerPassword}
              error={authError}
              onNameChange={setRegisterName}
              onEmailChange={setRegisterEmail}
              onPasswordChange={setRegisterPassword}
              onSubmit={handleRegister}
              onShowLogin={() => setShowLogin(true)}
            />
          )}
        </div>
      </main>
    )
  }

  return (
    <main className="grid lg:grid-cols-[280px_minmax(0,1fr)] grid-cols-1 min-h-screen">
      <Sidebar
        tone={tone}
        onToneChange={setTone}
        onLogout={logout}
      />

      <section className="grid gap-5.5 lg:p-6.5 md:p-5 p-4">
        <Header />

        <section className="grid gap-5.5 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.75fr)] grid-cols-1">
          <Chat
            messages={messages}
            messageDraft={messageDraft}
            selectedMood={selectedMood}
            moodOptions={moodOptions}
            onMessageChange={setMessageDraft}
            onMoodChange={setSelectedMood}
            onSend={handleSend}
          />

          <div className="grid gap-5.5">
            <MoodAnalytics moodSummary={moodSummary} />
            <Reminders reminders={reminders} onToggleReminder={toggleReminder} />
            <EmergencyContacts emergencyContacts={emergencyContacts} />
          </div>
        </section>

        <section id="journal" className="grid gap-5.5 lg:grid-cols-[minmax(320px,0.8fr)_minmax(0,1fr)] grid-cols-1" aria-label="Journal workspace">
          <JournalForm
            title={journalTitle}
            content={journalContent}
            mood={journalMood}
            moodOptions={moodOptions}
            onTitleChange={setJournalTitle}
            onContentChange={setJournalContent}
            onMoodChange={setJournalMood}
            onSubmit={handleJournalSave}
          />
          <JournalEntries journalEntries={journalEntries} />
        </section>
      </section>
    </main>
  )
}

export default App
