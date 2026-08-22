import React, { useState } from 'react'
import { Search, Mic } from 'lucide-react'
import { PALETTE } from '../utils/styles'
import { useNavigate } from 'react-router-dom'

const SearchBar = ({ onSearch }) => {
  const [q, setQ] = useState('')
  const { ink, muted } = PALETTE
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    const value = q.trim()
    if (!value) return
    if (onSearch) onSearch(value)
    else navigate(`/search?query=${encodeURIComponent(value)}`)
  }

  return (
    <div className="w-full">
      <form
        onSubmit={submit}
        className="mx-auto flex w-full max-w-3xl items-center gap-2 rounded-full px-2"
        style={{ backgroundColor: PALETTE.hover }}
      >
        <div className="flex items-center px-3">
          <Search size={18} color={muted} />
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search"
          className="w-full bg-transparent py-3 pr-2 text-sm outline-none"
          style={{ color: ink }}
        />

        <button
          type="submit"
          className="hidden rounded-full px-4 py-2 text-sm sm:inline-flex"
          style={{ color: PALETTE.ink}}
        >
          Search
        </button>

        <div className="ml-2 mr-1 flex items-center rounded-full p-2 opacity-80 sm:hidden">
          <Mic size={18} color={muted} />
        </div>
      </form>
    </div>
  )
}

export default SearchBar