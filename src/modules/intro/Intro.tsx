// src/components/Intro.tsx
import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type Props = { show: boolean; onDone: () => void }

const EASE = [0.22, 1, 0.36, 1] as const

export default function Intro({ show, onDone }: Props) {
  const steps = useMemo(
    () => [
      'Ein Tool zum Erstellen einfacher Verkehrsunfallskizzen',
      'Aus der Praxis, für die Praxis',
    ],
    []
  )

  const [step, setStep] = useState(0)
  const timers = useRef<number[]>([])

  // Kleiner Helper: Intro beenden + Hilfe öffnen
  const finish = () => {
    onDone()
    // kurz warten, damit das Overlay mit dem Exit-Anim verschwinden kann
    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent('app:open-help'))
    }, 150)
  }

  useEffect(() => {
    if (!show) return

    const STEP_MS = 1100
    steps.forEach((_, i) => {
      timers.current.push(window.setTimeout(() => setStep(i + 1), i * STEP_MS))
    })

    // Outro starten – danach Hilfe öffnen
    const OUTRO_MS = steps.length * STEP_MS + 900
    timers.current.push(window.setTimeout(finish, OUTRO_MS))

    return () => {
      timers.current.forEach(id => clearTimeout(id))
      timers.current = []
      setStep(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, steps.length])

  if (!show) return null

  return (
    <AnimatePresence>
      <motion.div
        key="intro"
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-white text-slate-900"
        // Start: Overlay voll sichtbar (großer Kreis)
        initial={{ opacity: 1, clipPath: 'circle(140% at 50% 50%)' }}
        animate={{ opacity: 1, clipPath: 'circle(140% at 50% 50%)' }}
        // Exit: Kreis schrumpft -> App “revealed”
        exit={{
          clipPath: 'circle(0% at 50% 50%)',
          transition: { duration: 0.85, ease: EASE },
        }}
      >
        <div className="mx-auto w-[min(92vw,760px)] px-6 text-center">
          {/* Logo */}
          <motion.img
            src="/logo.png"
            alt="033-Skizze Logo"
            decoding="async"
            loading="eager"
            width={480}
            height={240}
            className="mx-auto h-auto w-[320px] select-none"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            // Beim Outro: leichtes Scale + Blur + Fade
            exit={{
              opacity: 0,
              scale: 1.08,
              filter: 'blur(8px)',
              transition: { duration: 0.5, ease: EASE },
            }}
          />

          {/* Text-Zeilen nacheinander */}
          <div className="mt-6 space-y-2 text-sm sm:text-base text-slate-600">
            {steps.map((line, i) => (
              <motion.p
                key={line}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: step > i ? 1 : 0, y: step > i ? 0 : 6 }}
                exit={{
                  opacity: 0,
                  y: -6,
                  transition: { duration: 0.3, ease: 'easeOut' },
                }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="leading-relaxed"
              >
                {line}
              </motion.p>
            ))}
          </div>

          {/* Skip */}
          <motion.button
            onClick={finish}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-1.5 text-xs font-medium text-slate-600 shadow-sm backdrop-blur hover:bg-slate-50 active:scale-[0.99] transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Überspringen
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
