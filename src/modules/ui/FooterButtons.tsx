import { useAppStore } from '../../store/appStore'
import Button from './Button'

type Props = {
  onTheme?: () => void
  onFormat?: () => void
  onInfo?: () => void
  onHelp?: () => void
  onContact?: () => void
  className?: string
}

export default function FooterButtons({
  onTheme,
  onFormat,
  onInfo,
  onHelp,
  onContact,
  className,
}: Props) {
  const ui = useAppStore((s) => s.ui)
  const isDark = ui.theme === 'dark'

  const ICON = {
    theme:  isDark ? '/assets/sun.png'   : '/assets/moon.png',
    format: '/assets/rotate.png',
    info:   '/assets/info.png',
    help:   '/assets/help.png',
    contact:'/assets/contact.png',
  } as const

  // 👇 Ein Icon, das die Bitmap als Maske nutzt und mit currentColor füllt
  const MaskIcon = ({ src }: { src: string }) => (
    <span
      aria-hidden
      className="block h-5 w-5 select-none"
      style={{
        // Farbe kommt vom Button (currentColor -> var(--text) im Theme)
        backgroundColor: 'currentColor',
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
      }}
    />
  )

  const Item = ({
    icon, label, onClick,
  }: { icon: string; label: string; onClick?: () => void }) => (
    <Button
      type="button"
      onClick={onClick}
      variant="icon"
      size="md"
      title={label}
      aria-label={label}
      // Optional: leichte stärkere Sichtbarkeit beim Hover
      // className="hover:text-[var(--primary)]"
    >
      <MaskIcon src={icon} />
    </Button>
  )

  return (
    <div className={['flex items-center justify-center gap-2', className].filter(Boolean).join(' ')}>
      <Item icon={ICON.theme}   label="Theme wechseln"  onClick={onTheme} />
      <Item icon={ICON.format}  label="Format wechseln" onClick={onFormat} />
      <Item icon={ICON.info}    label="Info"            onClick={onInfo} />
      <Item icon={ICON.help}    label="Hilfe"           onClick={onHelp} />
      <Item icon={ICON.contact} label="Kontakt"         onClick={onContact} />
    </div>
  )
}
