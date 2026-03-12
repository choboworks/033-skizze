import type { Command, TransformType } from './types'
import { BatchCommand } from './commands'

const ROTATION_COMMIT_DELAY = 100   // ms (kurz für Rotation)
const DEFAULT_COMMIT_DELAY = 100   // ms (länger für Move/Scale - verhindert vorzeitiges Commit)

export class TransactionManager {
  private currentTransaction: Command[] = []
  private transactionType: TransformType | null = null
  private commitTimeout: ReturnType<typeof setTimeout> | null = null
  private onCommit: ((cmd: Command) => void) | null = null

  setCommitCallback(callback: (cmd: Command) => void) {
    this.onCommit = callback
  }

startTransaction(type: TransformType) {
  this.endTransaction() // Commit alte Transaction
  this.transactionType = type
  this.currentTransaction = []
}

addCommand(cmd: Command) {
  // Merge mit letztem Command wenn möglich
  const last = this.currentTransaction[this.currentTransaction.length - 1]
  
  if (last?.canMergeWith?.(cmd)) {
    last.merge?.(cmd)
  } else {
    this.currentTransaction.push(cmd)
  }

  // Auto-Commit Timer bei jedem Command zurücksetzen
  this.scheduleCommit()
}

private scheduleCommit() {
  // Clear existing timer
  if (this.commitTimeout) {
    clearTimeout(this.commitTimeout)
  }

  // 🔥 NEU: Kein Auto-Timer für Move!
  if (this.transactionType === 'move') {
    return  // ← Move committed nur manuell
  }

  // Nur für rotate/scale
  const delay = this.transactionType === 'rotate' 
    ? ROTATION_COMMIT_DELAY 
    : DEFAULT_COMMIT_DELAY

  this.commitTimeout = setTimeout(() => {
    this.endTransaction()
  }, delay)
}

endTransaction() {
  
  if (this.commitTimeout) {
    clearTimeout(this.commitTimeout)
    this.commitTimeout = null
  }

  if (this.currentTransaction.length === 0) {
    return
  }

  // Single command oder Batch?
  const finalCommand = this.currentTransaction.length === 1
    ? this.currentTransaction[0]
    : new BatchCommand(this.currentTransaction)

  if (this.onCommit) {
    this.onCommit(finalCommand)
  }

  this.currentTransaction = []
  this.transactionType = null
}

  forceCommit() {
    this.endTransaction()
  }

  clear() {
    if (this.commitTimeout) {
      clearTimeout(this.commitTimeout)
      this.commitTimeout = null
    }
    this.currentTransaction = []
    this.transactionType = null
  }
}