import { AnimatePresence, motion } from 'motion/react'
import { BarChart3, BookOpen, Compass, Globe2, Menu, Settings, Stamp as StampIcon, UserCircle2, Volume2, VolumeX, X } from 'lucide-react'
import { useState } from 'react'
import type { Route } from '../hooks/useRoute'
import { useSettings } from '../hooks/useStores'
import { unlockAudio } from '../lib/sound'
import { settingsStore } from '../lib/storage'
import { Logo } from './ui'

const PRIMARY = [
  { href: '#/', en: 'EXPLORE', ko: '탐험', match: ['home'], icon: Globe2 },
  { href: '#/destination', en: 'DISCOVER', ko: '발견', match: ['destination'], icon: Compass },
  { href: '#/collection', en: 'COLLECT', ko: '수집', match: ['collection'], icon: StampIcon },
] as const

const SECONDARY = [
  { href: '#/passport', label: '디지털 여권', en: 'PASSPORT', match: 'passport', icon: BookOpen },
  { href: '#/stats', label: '여행 기록 & 통계', en: 'TRAVEL LOG', match: 'stats', icon: BarChart3 },
] as const

function SoundToggle() {
  const { sound } = useSettings()
  return (
    <button
      onClick={() => {
        unlockAudio()
        settingsStore.set({ sound: !sound })
      }}
      className="rounded-full p-1.5 text-paper/80 transition hover:text-yellow"
      aria-label={sound ? '효과음 끄기' : '효과음 켜기'}
      aria-pressed={sound}
      title={sound ? '효과음 켜짐' : '효과음 꺼짐'}
    >
      {sound ? <Volume2 className="h-5.5 w-5.5" strokeWidth={1.8} /> : <VolumeX className="h-5.5 w-5.5" strokeWidth={1.8} />}
    </button>
  )
}

export function TopNav({ route }: { route: Route }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 w-full border-b-[3px] border-ink bg-board">
      <div className="mx-auto flex h-[64px] max-w-[1600px] items-center justify-between gap-6 px-4 md:px-8">
        <a href="#/" className="shrink-0" aria-label="RANDOM PASSPORT 홈">
          <Logo className="h-[28px] w-auto md:h-[32px]" />
        </a>

        <nav className="hidden items-center gap-1.5 lg:flex" aria-label="주요 메뉴">
          {PRIMARY.map((item) => {
            const active = (item.match as readonly string[]).includes(route.name)
            return (
              <a
                key={item.en}
                href={item.href}
                className={`rounded-lg border-2 px-3 py-1 font-mono text-[12px] font-semibold tracking-[0.14em] transition ${
                  active ? 'nav-pill-active' : 'border-transparent text-paper/75 hover:text-paper'
                }`}
                aria-current={active ? 'page' : undefined}
                title={item.ko}
              >
                {item.en}
              </a>
            )
          })}
          <span className="mx-2 h-5 w-[2px] bg-paper/25" />
          {SECONDARY.map((item) => {
            const active = route.name === item.match
            return (
              <a
                key={item.href}
                href={item.href}
                className={`rounded-lg border-2 px-3.5 py-1 text-[13px] font-semibold transition ${
                  active ? 'nav-pill-active' : 'border-paper/30 text-paper/85 hover:border-paper/70 hover:text-paper'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </a>
            )
          })}
        </nav>

        <div className="flex items-center gap-1">
          <SoundToggle />
          <a
            href="#/settings"
            className={`hidden rounded-full p-1.5 transition lg:inline-flex ${route.name === 'settings' ? 'text-yellow' : 'text-paper/80 hover:text-yellow'}`}
            aria-label="설정"
            title="설정"
          >
            <UserCircle2 className="h-6 w-6" strokeWidth={1.6} />
          </a>
          <button className="rounded-full p-1.5 text-paper/85 transition hover:text-yellow lg:hidden" onClick={() => setOpen(true)} aria-label="메뉴 열기">
            <Menu className="h-6 w-6" strokeWidth={1.8} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[90] bg-[#1c1d21]/50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
            <motion.nav
              className="glass absolute right-3 top-3 w-[min(320px,calc(100vw-24px))] p-4"
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              aria-label="모바일 메뉴"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="eyebrow">MENU</span>
                <button onClick={() => setOpen(false)} className="rounded-full p-1.5 text-ink hover:bg-yellow" aria-label="메뉴 닫기">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {[...PRIMARY.map((p) => ({ href: p.href, label: p.ko, en: p.en, icon: p.icon, active: (p.match as readonly string[]).includes(route.name) })),
                ...SECONDARY.map((s) => ({ href: s.href, label: s.label, en: s.en, icon: s.icon, active: route.name === s.match })),
                { href: '#/settings', label: '설정', en: 'SETTINGS', icon: Settings, active: route.name === 'settings' }].map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`mb-1 flex items-center gap-3 rounded-lg border-2 px-3 py-2.5 transition ${l.active ? 'nav-pill-active' : 'border-transparent text-mute hover:bg-surface-light hover:text-ink'}`}
                >
                  <l.icon className="h-4.5 w-4.5" />
                  <span className="flex-1 text-[15px] font-medium">{l.label}</span>
                  <span className="font-mono text-[10px] tracking-[0.14em] text-dim">{l.en}</span>
                </a>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
