import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'
import { login } from '../services/auth.service'
import { PALETTE, TYPOGRAPHY } from "../utils/styles.js"

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    console.log(email,password)

    try {
      const res = await login({ email, password })
      console.log(res);
      
      navigate('/')
    } catch (err) {
      console.log(err)
      setError(err?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 sm:px-6"
      style={{
        background: `radial-gradient(circle at top left, ${PALETTE.accent}22 0%, transparent 35%), linear-gradient(135deg, ${PALETTE.page} 0%, #111111 100%)`,
        fontFamily: TYPOGRAPHY.font,
      }}
    >
      <form
        onSubmit={submit}
        className="w-full max-w-4xl overflow-hidden rounded-3xl shadow-2xl sm:flex"
        style={{
          backgroundColor: PALETTE.card,
          border: `1px solid ${PALETTE.line}`,
          boxShadow: `0 24px 70px rgba(0, 0, 0, 0.45)`,
        }}
      >
        <div
          className="hidden sm:flex sm:w-36 sm:flex-col sm:items-center sm:justify-between sm:py-10 sm:relative"
          style={{ backgroundColor: PALETTE.rail, color: PALETTE.railText }}
        >
          <div className="absolute right-[-7px] top-[-7px] h-4 w-4 rounded-full" style={{ backgroundColor: PALETTE.page }} />
          <span className="rotate-180 text-[0.65rem] uppercase tracking-[0.35em]" style={{ writingMode: 'vertical-rl', fontWeight: TYPOGRAPHY.semibold }}>
            Welcome back
          </span>
          <span className="m-2 text-[0.7rem] opacity-60" style={{ fontWeight: TYPOGRAPHY.light }}>
            Sign in to continue
          </span>
          <div className="absolute bottom-[-7px] right-[-7px] h-4 w-4 rounded-full" style={{ backgroundColor: PALETTE.page }} />
        </div>

        <div className="flex-1 p-7 sm:p-10">
          <p className="mb-2 text-xs uppercase tracking-[0.35em]" style={{ color: PALETTE.muted, fontSize: TYPOGRAPHY.small, fontWeight: TYPOGRAPHY.medium }}>
            Account access
          </p>
          <h2 className="mb-2" style={{ color: PALETTE.ink, fontSize: TYPOGRAPHY.h2, fontWeight: TYPOGRAPHY.bold, lineHeight: TYPOGRAPHY.lineTitle }}>
            Sign in
          </h2>
          <p className="mb-6 text-sm" style={{ color: PALETTE.muted, fontSize: TYPOGRAPHY.body, lineHeight: TYPOGRAPHY.lineBody }}>
            Welcome back. Enter your details to continue.
          </p>

          {error && (
            <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-500/20 p-3" style={{ backgroundColor: '#2a1414', borderLeft: `4px solid ${PALETTE.error}` }}>
              <AlertCircle size={16} color={PALETTE.error} className="mt-0.5 flex-shrink-0" />
              <span className="text-sm" style={{ color: PALETTE.error, fontSize: TYPOGRAPHY.body, fontWeight: TYPOGRAPHY.medium }}>
                {error}
              </span>
            </div>
          )}

          <label className="mb-5 block">
            <span className="mb-2 block text-[0.7rem] uppercase tracking-[0.3em]" style={{ color: PALETTE.muted, fontWeight: TYPOGRAPHY.medium }}>
              Email
            </span>
            <div className="flex items-center gap-2 rounded-2xl border border-transparent px-3 py-3 transition-all" style={{ backgroundColor: PALETTE.surface, borderColor: PALETTE.line }}>
              <Mail size={16} color={PALETTE.muted} />
              <input
                className="flex-1 bg-transparent outline-none"
                style={{ color: PALETTE.ink, fontSize: TYPOGRAPHY.input, fontWeight: TYPOGRAPHY.regular }}
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
          </label>

          <label className="mb-7 block">
            <span className="mb-2 block text-[0.7rem] uppercase tracking-[0.3em]" style={{ color: PALETTE.muted, fontWeight: TYPOGRAPHY.medium }}>
              Password
            </span>
            <div className="flex items-center gap-2 rounded-2xl border border-transparent px-3 py-3 transition-all" style={{ backgroundColor: PALETTE.surface, borderColor: PALETTE.line }}>
              <Lock size={16} color={PALETTE.muted} />
              <input
                type="password"
                className="flex-1 bg-transparent outline-none"
                style={{ color: PALETTE.ink, fontSize: TYPOGRAPHY.input, fontWeight: TYPOGRAPHY.regular }}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          </label>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-xs uppercase tracking-[0.3em] transition-all"
            style={{ backgroundColor: PALETTE.accent, color: PALETTE.railText, fontWeight: TYPOGRAPHY.semibold }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = PALETTE.accentDark)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = PALETTE.accent)}
          >
            Sign in
            <ArrowRight size={14} />
          </button>
          
           <div className='flex justify-center flex-col items-center pt-6'>
          <p 
          style={{ color: PALETTE.muted }}
          >
            Don't have an account
            </p>
          <p  
          className='cursor-pointer'
          style={{color: PALETTE.blue}}
          onClick={ () => { navigate("/register")} }
          >Create an account</p>
        </div>
        </div>
       
      </form>
       
        
    </div>
  )
}
