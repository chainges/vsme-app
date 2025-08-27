'use client'

import React from 'react'
import { useForm } from '@tanstack/react-form'

/**
 * Simple test component to isolate TanStack Forms behavior
 * This bypasses our abstractions to test basic functionality
 */
export const SimpleFormTest: React.FC = () => {
  const form = useForm({
    defaultValues: {
      testField: '',
    },
    onSubmit: async ({ value }) => {
      console.log('Form submitted:', value)
    },
  })

  return (
    <div className="p-6 border rounded-lg max-w-md">
      <h2 className="text-lg font-semibold mb-4">Simple TanStack Form Test</h2>
      
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <form.Field
          name="testField"
          children={(field) => (
            <div className="space-y-2">
              <label htmlFor="testField" className="block text-sm font-medium">
                Test Field
              </label>
              <input
                id="testField"
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Type something..."
              />
              <p className="text-xs text-gray-500">
                Current value: "{field.state.value}" (length: {field.state.value.length})
              </p>
            </div>
          )}
        />
        
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Submit
        </button>
        
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <h3 className="text-sm font-medium">Form State:</h3>
          <pre className="text-xs mt-1">
            {JSON.stringify(form.state.values, null, 2)}
          </pre>
        </div>
      </form>
    </div>
  )
}

export default SimpleFormTest