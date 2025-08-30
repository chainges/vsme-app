'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ModeToggle } from '../common/mode-toggle'

// Helper function to generate breadcrumbs from pathname
function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: Array<{ label: string; href: string; isLast: boolean }> = []

  // Handle different top-level pages
  if (segments.length === 0 || pathname === '/') {
    return breadcrumbs
  }

  // For each segment, create a breadcrumb
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    const href = '/' + segments.slice(0, i + 1).join('/')
    const isLast = i === segments.length - 1

    // Format segment name (capitalize and replace hyphens with spaces)
    const label = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    breadcrumbs.push({
      label,
      href,
      isLast,
    })
  }

  return breadcrumbs
}

interface HeaderProps {
  isDashboard?: boolean
  className?: string
}

export default function Header({ isDashboard = false, className = '' }: HeaderProps) {
  const pathname = usePathname()
  const links = [{ to: '/', label: 'Home' }]

  // Dashboard header layout
  if (isDashboard) {
    const breadcrumbs = generateBreadcrumbs(pathname)

    return (
      <header
        className={`mb-4 flex h-12 shrink-0 items-center gap-2 shadow transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 sm:h-14 ${className}`}
      >
        <div className="flex items-center gap-2 px-3 sm:px-4">
          <SidebarTrigger className="-ml-1 min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-[32px]" />
          <Separator className="mr-2 h-4" orientation="vertical" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((breadcrumb, index) => (
                <React.Fragment key={breadcrumb.href}>
                  <BreadcrumbItem>
                    {breadcrumb.isLast ? (
                      <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!breadcrumb.isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto flex items-center gap-2 px-3 sm:px-4">
          <ModeToggle />
        </div>
      </header>
    )
  }

  // Regular header layout
  return (
    <div>
      <div className="flex flex-row items-center justify-between px-2 py-1">
        <nav className="flex gap-4 text-lg">
          {links.map(({ to, label }) => {
            return (
              <Link href={to} key={to}>
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
      <hr />
    </div>
  )
}
