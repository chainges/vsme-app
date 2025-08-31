'use client'

import {
  AudioWaveform,
  Bot,
  Command,
  FolderOpen,
  Frame,
  GalleryVerticalEnd,
  Info,
  Settings2,
  SquareTerminal,
} from 'lucide-react'
import type * as React from 'react'

import { NavMain, NavProjects, NavUser, TeamSwitcher } from '@/components'
import { ErrorBoundary } from '@/components/common/error-boundary'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { useMockAuth } from '@/contexts/mock-auth-context'

// VSME Guru specific data
const data = {
  user: {
    name: 'John Doe',
    email: 'john.doe@vsme-guru.com',
    avatar: 'https://github.com/shadcn.png',
  },
  teams: [
    {
      name: 'VSME Guru',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Sustainability Corp',
      logo: AudioWaveform,
      plan: 'Pro',
    },
    {
      name: 'Green Solutions',
      logo: Command,
      plan: 'Starter',
    },
  ],
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'Overview',
          url: '/dashboard',
        },
      ],
    },
    {
      title: 'General Info',
      url: '/generalinfo',
      icon: Info,
      items: [
        {
          title: 'General Information',
          url: '/generalinfo',
        },
      ],
    },
    {
      title: 'Projects',
      url: '/projects',
      icon: FolderOpen,
      items: [
        {
          title: 'All Projects',
          url: '/projects',
        },
      ],
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings2,
      items: [
        {
          title: 'Account Settings',
          url: '/settings',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Current Projects',
      url: '/projects',
      icon: Frame,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useMockAuth()

  // Use mock auth user data if available, otherwise fallback to default
  const userData = user
    ? {
        name: user.name,
        email: user.email,
        avatar: user.avatar || 'https://github.com/shadcn.png',
      }
    : data.user

  return (
    <ErrorBoundary>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <ErrorBoundary>
            <TeamSwitcher teams={data.teams} />
          </ErrorBoundary>
        </SidebarHeader>
        <SidebarContent>
          <ErrorBoundary>
            <NavMain items={data.navMain} />
          </ErrorBoundary>
          <ErrorBoundary>
            <NavProjects projects={data.projects} />
          </ErrorBoundary>
        </SidebarContent>
        <SidebarFooter>
          <ErrorBoundary>
            <NavUser user={userData} />
          </ErrorBoundary>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </ErrorBoundary>
  )
}
