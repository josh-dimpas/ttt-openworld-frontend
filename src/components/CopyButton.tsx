import { Check, Copy } from 'lucide-react'
import { Button } from './ui/button'
import { useState } from 'react'

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    setCopied(true)

    navigator.clipboard
      .writeText(text)
      .catch((err) => console.error('Failed to copy:', err))

    setTimeout(() => {
      setCopied(false)
    }, 500)
  }

  return (
    <Button
      size="icon"
      className="size-8"
      onClick={copy}
      variant={copied ? 'secondary' : 'outline'}
    >
      {copied ? <Check /> : <Copy />}
    </Button>
  )
}
