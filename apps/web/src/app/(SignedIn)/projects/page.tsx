'use client'

import { Calendar, FileText, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const projects = [
  {
    id: 1,
    name: 'Q1 2024 Report',
    description:
      'Quarterly sustainability report covering environmental, social, and governance metrics',
    status: 'completed',
    dueDate: '2024-04-15',
    progress: 100,
    team: ['John Doe', 'Jane Smith', 'Mike Johnson'],
  },
  {
    id: 2,
    name: 'Sustainability Metrics',
    description: 'Comprehensive analysis of key sustainability indicators and benchmarks',
    status: 'in-progress',
    dueDate: '2024-05-30',
    progress: 65,
    team: ['Sarah Wilson', 'Tom Brown'],
  },
  {
    id: 3,
    name: 'VSME Compliance',
    description: 'Ensuring full compliance with VSME EU standard requirements',
    status: 'pending',
    dueDate: '2024-06-15',
    progress: 25,
    team: ['Alice Cooper', 'Bob Davis', 'Carol White'],
  },
]

function getStatusColor(status: string) {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'in-progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
}

export default function ProjectsPage() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-3xl tracking-tight">Projects</h1>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{project.name}</CardTitle>
                  <CardDescription className="mt-2">{project.description}</CardDescription>
                </div>
                <Badge className={getStatusColor(project.status)}>
                  {project.status.replace('-', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground text-sm">
                    Due: {new Date(project.dueDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground text-sm">
                    {project.team.length} team members
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="-space-x-2 flex">
                  {project.team.slice(0, 3).map((member, index) => (
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-500 font-medium text-white text-xs dark:border-gray-800"
                      key={member}
                      title={member}
                    >
                      {member
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                  ))}
                  {project.team.length > 3 && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-300 font-medium text-gray-600 text-xs dark:border-gray-800">
                      +{project.team.length - 3}
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  <Button size="sm">Edit</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
