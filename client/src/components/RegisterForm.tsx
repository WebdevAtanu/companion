import type { FormEvent } from 'react'

interface RegisterFormProps {
  name: string
  email: string
  password: string
  error: string
  onNameChange: (name: string) => void
  onEmailChange: (email: string) => void
  onPasswordChange: (password: string) => void
  onSubmit: (event: FormEvent) => void
  onShowLogin: () => void
}

export function RegisterForm({ name, email, password, error, onNameChange, onEmailChange, onPasswordChange, onSubmit, onShowLogin }: RegisterFormProps) {
  return (
    <form className="bg-white border border-[#e2e8f0] rounded-xl flex flex-col gap-4 max-w-100 w-full p-8" onSubmit={onSubmit}>
      <h2 className="text-2xl font-semibold m-0 mb-2">Register</h2>
      {error && <p className="text-red-600 text-sm m-0">{error}</p>}
      <input
        type="text"
        placeholder="Name (optional)"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        className="border border-[#e2e8f0] rounded-lg p-3 text-base"
      />
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
        Register
      </button>
      <button type="button" onClick={onShowLogin} className="bg-transparent text-[#64748b] hover:bg-[#f1f5f9]">
        Already have an account? Login
      </button>
    </form>
  )
}
