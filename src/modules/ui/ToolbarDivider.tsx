export default function ToolbarDivider({ className = '' }: { className?: string }) {
  return <div className={['h-6 w-px mx-1 bg-[var(--border)]/70', className].join(' ')} />
}
