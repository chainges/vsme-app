// Test file to verify all components can be imported correctly

import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu'
import { Separator } from './separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './sheet'
import { Sidebar, SidebarInset, SidebarProvider, SidebarTrigger } from './sidebar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

// This file is just for testing imports - it won't be used in the actual app
export function TestImports() {
  return (
    <div>
      <p>All components imported successfully!</p>
    </div>
  )
}
