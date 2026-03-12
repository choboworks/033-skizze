import { useEffect, useMemo, useState } from 'react'
import Button from './Button'

type Props = {
  open: boolean
  onClose: () => void
}

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function ContactDialog({ open, onClose }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('') // Honeypot
  const [status, setStatus] = useState<Status>('idle')
  const [errMsg, setErrMsg] = useState<string>('')

  // ESC zum Schließen
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Reset bei Schließen
  useEffect(() => {
    if (!open) {
      setStatus('idle')
      setErrMsg('')
      setName('')
      setEmail('')
      setMessage('')
      setWebsite('')
    }
  }, [open])

  const emailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
    [email]
  )

  const canSend = emailValid && message.trim().length > 0 && status !== 'sending'

  const inputCls =
    'mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-sm ' +
    'focus:outline-none focus:ring-2 focus:ring-[var(--ring)]'
  const labelCls = 'block text-sm font-medium text-[var(--text)]'

  if (!open) return null

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!canSend) return
    setStatus('sending')
    setErrMsg('')

    try {
      const res = await fetch('/api/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          website: website.trim(), // Honeypot
        }),
      })

      let text = ''
      let data: unknown = null
      try {
        data = await res.json()
      } catch {
        text = await res.text().catch(() => '')
      }

      if (!res.ok) {
        const msg =
          (typeof data === 'object' &&
            data !== null &&
            'error' in data &&
            typeof (data as { error: string }).error === 'string'
            ? (data as { error: string }).error
            : typeof data === 'object' &&
              data !== null &&
              'message' in data &&
              typeof (data as { message: string }).message === 'string'
            ? (data as { message: string }).message
            : text || `HTTP ${res.status}`)

        throw new Error(msg)
      }

      setStatus('success')
      setTimeout(onClose, 1500)
    } catch (err) {
      setStatus('error')
      setErrMsg(err instanceof Error ? err.message : 'Unbekannter Fehler')
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-title"
      className="fixed inset-0 z-[1000] flex items-center justify-center p-2 sm:p-4"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" onClick={onClose} />

      {/* Scaling-Wrapper */}
      <div className="relative z-[1001] toolbar-scale">
        {/* Dialog */}
        <div className="w-[min(720px,92vw)] max-h-[min(86vh,calc(100vh-2rem))] overflow-hidden rounded-2xl bg-[var(--panel)] shadow-xl ring-1 ring-black/5">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]">
            <h2 id="contact-title" className="text-[15px] font-medium text-[var(--text)]">
              Kontakt
            </h2>
            <Button
              type="button"
              variant="icon"
              size="md"
              onClick={onClose}
              aria-label="Schließen"
              data-prevent-clear-selection
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className="text-[var(--text-muted)]">
                <path d="M6.75 6.75l10.5 10.5M17.25 6.75l-10.5 10.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </Button>
          </div>

          {/* Content */}
          <form
            id="contact-form"
            onSubmit={handleSubmit}
            className="px-5 pt-4 pb-5 text-[13.5px] leading-6 text-[var(--text)] overflow-auto"
            aria-busy={status === 'sending'}
          >
            <p className="mb-3">
              Fragen, Feedback oder Hinweise? Schreib mir eine kurze Nachricht. Pflichtfelder sind mit * markiert.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls} htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  className={inputCls}
                  placeholder="(optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  maxLength={120}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="contact-email">E-Mail *</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  className={inputCls}
                  placeholder="z. B. name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  aria-invalid={!emailValid && email.trim().length > 0}
                />
                {!emailValid && email.trim().length > 0 && (
                  <p className="mt-1 text-xs text-[var(--danger)]">Bitte eine gültige E-Mail eingeben.</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className={labelCls} htmlFor="contact-message">Nachricht *</label>
              <textarea
                id="contact-message"
                rows={5}
                required
                className={inputCls}
                placeholder="Wie kann ich helfen?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={5000}
              />
            </div>

            {/* Honeypot */}
            <div className="hidden">
              <label htmlFor="contact-website">Website</label>
              <input
                id="contact-website"
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                autoComplete="off"
                tabIndex={-1}
              />
            </div>

            {/* Status */}
            <div className="mt-3" aria-live="polite">
              {status === 'error' && (
                <div className="text-sm text-[var(--danger)]">
                  Senden fehlgeschlagen: {errMsg || 'Bitte später erneut versuchen.'}
                </div>
              )}
              {status === 'success' && (
                <div className="text-sm text-[var(--success)]">
                  Vielen Dank! Deine Nachricht wurde gesendet.
                </div>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-[var(--border)]">
            <Button
              type="button"
              variant="subtle"
              size="md"
              onClick={onClose}
              disabled={status === 'sending'}
            >
              Abbrechen
            </Button>
            <Button
              type="submit"
              form="contact-form"
              variant="primary"
              size="md"
              disabled={!canSend}
            >
              {status === 'sending' ? 'Senden…' : 'Senden'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
