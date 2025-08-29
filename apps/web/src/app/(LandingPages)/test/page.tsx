'use client'

import { useState } from 'react'
import { InlineEditableInput } from '@/components/inline/input'
import { InlineEditableTextarea } from '@/components/inline/text-area'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DemoPage() {
  const [name, setName] = useState('John Doe')
  const [title, setTitle] = useState('Software Engineer')
  const [bio, setBio] = useState(
    'I love building user interfaces and creating great user experiences.'
  )
  const [bio2, setBio2] = useState('I love building houses.')
  const [email, setEmail] = useState('')

  return (
    <div className="container mx-auto py-10 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Inline Editable Fields</CardTitle>
          <CardDescription>Click on any field to edit it</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Name</label>
            <InlineEditableInput value={name} onChange={setName} placeholder="Enter your name" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Title</label>
            <InlineEditableInput value={title} onChange={setTitle} placeholder="Enter your title" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Bio</label>
            <InlineEditableInput
              value={bio}
              onChange={setBio}
              placeholder="Enter your bio"
              className="min-h-[60px]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Bio2</label>
            <InlineEditableTextarea
              value={bio2}
              onChange={setBio2}
              placeholder="Enter your bio2"
              className="min-h-[60px]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <InlineEditableInput value={email} onChange={setEmail} placeholder="Enter your email" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
