// src/modules/footer/FooterIndex.tsx
import { useCallback, useEffect, useState } from 'react'
import FooterButtons from '../ui/FooterButtons'
import InfoDialog from '../ui/InfoDialog'
import HelpDialog from '../ui/HelpDialog'
import ContactDialog from '../ui/ContactDialog'

type Props = {
  className?: string
  onTheme?: () => void
  onFormat?: () => void
  onInfo?: () => void
  onHelp?: () => void
  onContact?: () => void
}

/**
 * Footer-Iconleiste + (Fallback-)Dialoge.
 * - Wenn onInfo/onHelp/onContact übergeben sind, werden sie verwendet.
 * - Wenn nicht, öffnet der interne State die jeweiligen Dialoge.
 * - Zusätzlich reagieren wir auf window-Events: app:open-info/help/contact.
 */
export default function FooterIndex({
  className,
  onTheme,
  onFormat,
  onInfo,
  onHelp,
  onContact,
}: Props) {
  // Fallback-Dialog-States
  const [infoOpen, setInfoOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  // Fallback-Opener
  const openInfo = useCallback(() => setInfoOpen(true), [])
  const closeInfo = useCallback(() => setInfoOpen(false), [])

  const openHelp = useCallback(() => setHelpOpen(true), [])
  const closeHelp = useCallback(() => setHelpOpen(false), [])

  const openContact = useCallback(() => setContactOpen(true), [])
  const closeContact = useCallback(() => setContactOpen(false), [])

  // Bridge: externe Events erlauben (öffnen interne Dialoge)
  useEffect(() => {
    const hInfo = () => openInfo()
    const hHelp = () => openHelp()
    const hContact = () => openContact()
    window.addEventListener('app:open-info', hInfo as EventListener)
    window.addEventListener('app:open-help', hHelp as EventListener)
    window.addEventListener('app:open-contact', hContact as EventListener)
    return () => {
      window.removeEventListener('app:open-info', hInfo as EventListener)
      window.removeEventListener('app:open-help', hHelp as EventListener)
      window.removeEventListener('app:open-contact', hContact as EventListener)
    }
  }, [openInfo, openHelp, openContact])

  // Click-Handler mit Fallback
  const handleTheme = useCallback(() => {
    if (onTheme) { onTheme(); return }
    window.dispatchEvent(new CustomEvent('app:toggle-theme'))
  }, [onTheme])

  const handleFormat = useCallback(() => {
    if (onFormat) { onFormat(); return }
    window.dispatchEvent(new CustomEvent('app:toggle-format'))
  }, [onFormat])

  const handleInfo = useCallback(() => {
    if (onInfo) { onInfo(); return }
    openInfo()
  }, [onInfo, openInfo])

  const handleHelp = useCallback(() => {
    if (onHelp) { onHelp(); return }
    openHelp()
  }, [onHelp, openHelp])

  const handleContact = useCallback(() => {
    if (onContact) { onContact(); return }
    openContact()
  }, [onContact, openContact])

  return (
    <>
      <FooterButtons
        className={className}
        onTheme={handleTheme}
        onFormat={handleFormat}
        onInfo={handleInfo}
        onHelp={handleHelp}
        onContact={handleContact}
      />

      {/* Fallback-Dialoge (werden nur genutzt, wenn keine externen Handler vorhanden sind) */}
      <InfoDialog open={infoOpen && !onInfo} onClose={closeInfo} />
      <HelpDialog open={helpOpen && !onHelp} onClose={closeHelp} />
      <ContactDialog open={contactOpen && !onContact} onClose={closeContact} />
    </>
  )
}
