import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoaderProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export default function Loader({ className, size = 'md', text }: LoaderProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  return (
    <div className={cn('flex h-full items-center justify-center pt-8', className)}>
      <div className="flex flex-col items-center gap-2">
        <Loader2 className={cn('animate-spin', sizeClasses[size])} />
        {text && <p className="text-muted-foreground text-sm">{text}</p>}
      </div>
    </div>
  )
}

// Inline loader for smaller spaces
export function InlineLoader({ className, size = 'sm' }: Omit<LoaderProps, 'text'>) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  return <Loader2 className={cn('animate-spin', sizeClasses[size], className)} />
}

// Page-level loader
export function PageLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">{text}</p>
      </div>
    </div>
  )
}

// Button loader
export function ButtonLoader({ className }: { className?: string }) {
  return <Loader2 className={cn('h-4 w-4 animate-spin', className)} />
}
