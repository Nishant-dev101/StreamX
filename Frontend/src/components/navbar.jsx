import React, { useState } from 'react'
import { Home, LayoutList, Heart, ListVideo, User, ChevronRight, ChevronLeft } from 'lucide-react'
import { PALETTE } from '../utils/styles'
import { useNavigate } from "react-router-dom"

const navItems = [
  { label: "Home", path: "/", icon: Home },
  { label: "Subscriptions", path: "/subscriptions", icon: LayoutList },
  { label: "Liked Videos", path: "/liked-videos", icon: Heart },
  { label: "Playlists", path: "/playlist", icon: ListVideo },
  { label: "You", path: "/user", icon: User },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { navbar, railText, active, accent, line, muted } = PALETTE
  const navigate = useNavigate()

  return (
    <aside
      className={`h-screen border-r transition-all w-20 ${isOpen ? 'sm:w-64' : 'sm:w-20'}`}
      style={{ backgroundColor: navbar, color: railText, borderColor: line }}
    >
      <nav className="flex h-full flex-col px-2 py-4 sm:px-3">
        <div className="mb-6 flex items-center justify-between">
          <div className={`items-center gap-4 ${isOpen ? 'hidden sm:flex' : 'hidden'}`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl" style={{ backgroundColor: active }}>
              <Home size={18} color={accent} />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-semibold" style={{ color: accent }}>
                StreamX
              </p>
              <p className="text-xs" style={{ color: muted }}>
                Your feed
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="ml-auto hidden h-10 w-10 items-center justify-center rounded-2xl transition-all duration-300 hover:bg-white/10 sm:flex"
            style={{ color: railText }}
            aria-label="Toggle navbar"
          >
            {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                type="button"
                className={`flex items-center rounded-2xl p-3 transition-all duration-300 hover:bg-white/10 ${isOpen ? 'justify-start gap-3 sm:px-4 sm:py-3' : 'justify-center w-full'}`}
                style={{ color: railText }}
                onClick={ () => {navigate(item.path)}}
              >
                <span className="flex h-10 w-10 min-w-[40px] items-center justify-center rounded-2xl" style={{ backgroundColor: active }}>
                  <Icon size={18} color={accent} />
                </span>
                <span className={`${isOpen ? 'hidden sm:block' : 'hidden'} text-sm font-medium`} style={{ color: railText }}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}

export default Navbar