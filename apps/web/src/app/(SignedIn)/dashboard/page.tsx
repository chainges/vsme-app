'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useMockAuth } from '@/contexts/mock-auth-context'

export default function DashboardPage() {
  const { user } = useMockAuth()

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-3xl tracking-tight">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">12</div>
            <p className="text-muted-foreground text-xs">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Compliance Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">87%</div>
            <p className="text-muted-foreground text-xs">+5% from last quarter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Environmental Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">92%</div>
            <p className="text-muted-foreground text-xs">+3% from last quarter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">3</div>
            <p className="text-muted-foreground text-xs">2 due this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest sustainability reporting activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <div className="flex-1">
                <p className="font-medium text-sm">Q1 2024 Environmental Report submitted</p>
                <p className="text-muted-foreground text-xs">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <div className="flex-1">
                <p className="font-medium text-sm">Energy usage data updated</p>
                <p className="text-muted-foreground text-xs">1 day ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-2 w-2 rounded-full bg-yellow-500" />
              <div className="flex-1">
                <p className="font-medium text-sm">Compliance review scheduled</p>
                <p className="text-muted-foreground text-xs">3 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Welcome back, {user?.name || 'User'}!</CardTitle>
            <CardDescription>
              Here's what's happening with your sustainability reporting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                <h4 className="font-medium text-blue-900 dark:text-blue-100">Next Deadline</h4>
                <p className="text-blue-700 text-sm dark:text-blue-300">
                  Q2 2024 Report due in 15 days
                </p>
              </div>
              <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950">
                <h4 className="font-medium text-green-900 dark:text-green-100">
                  Completed This Month
                </h4>
                <p className="text-green-700 text-sm dark:text-green-300">
                  2 reports submitted successfully
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
