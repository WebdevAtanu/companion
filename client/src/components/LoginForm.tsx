import type { FormEvent } from 'react'

interface LoginFormProps {
  email: string
  password: string
  error: string
  onEmailChange: (email: string) => void
  onPasswordChange: (password: string) => void
  onSubmit: (event: FormEvent) => void
  onBack: () => void
}

export function LoginForm({ email, password, error, onEmailChange, onPasswordChange, onSubmit, onBack }: LoginFormProps) {
  return (
    <form className="bg-white border border-[#e2e8f0] rounded-xl flex flex-col gap-4 max-w-100 w-full p-8" onSubmit={onSubmit}>
      <h2 className="text-2xl font-semibold m-0 mb-2">Login</h2>
      {error && <p className="text-red-600 text-sm m-0">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        required
        className="border border-[#e2e8f0] rounded-lg p-3 text-base"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        required
        className="border border-[#e2e8f0] rounded-lg p-3 text-base"
      />
      <button type="submit" className="bg-[#1f2933] border-none rounded-lg text-white cursor-pointer text-base font-semibold p-3 hover:bg-[#374151] transition-colors">
        Login
      </button>
      <button type="button" onClick={onBack} className="bg-transparent text-[#64748b] hover:bg-[#f1f5f9]">
        Back
      </button>
    </form>
  )
}
