'use client'

import { ChevronsUpDown, Plus } from 'lucide-react'
import * as React from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])

  if (!activeTeam) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              aria-label={`Switch organization, currently ${activeTeam.name}`}
              className={`data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground ${
                isMobile ? 'min-h-[48px] py-3' : ''
              }`}
              size="lg"
            >
              <div
                className={`flex aspect-square items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground ${
                  isMobile ? 'size-10' : 'size-8'
                }`}
              >
                <activeTeam.logo aria-hidden="true" className={isMobile ? 'size-5' : 'size-4'} />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeTeam.name}</span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown
                aria-hidden="true"
                className={`ml-auto ${isMobile ? 'size-5' : 'size-4'}`}
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Organizations
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                aria-label={`Switch to ${team.name} organization`}
                className="gap-2 p-2"
                key={team.name}
                onClick={() => setActiveTeam(team)}
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <team.logo aria-hidden="true" className="size-3.5 shrink-0" />
                </div>
                {team.name}
                <DropdownMenuShortcut aria-label={`Keyboard shortcut: Command ${index + 1}`}>
                  ⌘{index + 1}
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem aria-label="Add new organization" className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus aria-hidden="true" className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add organization</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
