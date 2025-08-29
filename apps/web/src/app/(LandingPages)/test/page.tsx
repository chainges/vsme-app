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
    <div className="container mx-auto max-w-md py-10">
      <Card>
        <CardHeader>
          <CardTitle>Inline Editable Fields</CardTitle>
          <CardDescription>Click on any field to edit it</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <label className="font-medium text-muted-foreground text-sm">Name</label>
            <InlineEditableInput onChange={setName} placeholder="Enter your name" value={name} />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-muted-foreground text-sm">Title</label>
            <InlineEditableInput onChange={setTitle} placeholder="Enter your title" value={title} />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-muted-foreground text-sm">Bio</label>
            <InlineEditableInput
              className="min-h-[60px]"
              onChange={setBio}
              placeholder="Enter your bio"
              value={bio}
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-muted-foreground text-sm">Bio2</label>
            <InlineEditableTextarea
              className="min-h-[60px]"
              onChange={setBio2}
              placeholder="Enter your bio2"
              value={bio2}
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-muted-foreground text-sm">Email</label>
            <InlineEditableInput onChange={setEmail} placeholder="Enter your email" value={email} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
