'use client'

import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CompletionScreenProps {
  title?: string
  description?: string
  onRestart?: () => void
  className?: string
}

export function CompletionScreen({ 
  title = "Setup Complete!",
  description = "Your sustainability reporting setup is complete. You can now proceed to enter your sustainability data.",
  onRestart,
  className 
}: CompletionScreenProps) {
  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className={`py-10 text-center ${className || ''}`}
      initial={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle2 className="h-8 w-8 text-primary" />
      </div>
      <h2 className="mb-2 font-bold text-2xl">{title}</h2>
      <p className="mb-6 text-muted-foreground">
        {description}
      </p>
      {onRestart && (
        <Button onClick={onRestart}>
          Start Over
        </Button>
      )}
    </motion.div>
  )
}