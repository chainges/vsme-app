'use client'

import React from 'react'
import { useForm } from '@tanstack/react-form'

/**
 * Minimal test following the exact TanStack Forms documentation pattern
 * Based on: https://github.com/tanstack/form/blob/main/docs/overview.md#_snippet_0
 */
export function MinimalFormTest() {
  const form = useForm({
    defaultValues: {
      firstName: '',
    },
    onSubmit: async ({ value }) => {
      console.log('Form submitted:', value)
    },
  })

  return (
    <div className="p-6 border rounded-lg max-w-md">
      <h2 className="text-lg font-semibold mb-4">Minimal TanStack Form Test</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.Field
          name="firstName"
          children={(field) => (
            <>
              <label htmlFor={field.name}>First Name:</label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
              />
              <div className="mt-2 text-sm">
                <div>Field value: "{field.state.value}"</div>
                <div>Form values: {JSON.stringify(form.state.values)}</div>
              </div>
            </>
          )}
        />
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md"
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default MinimalFormTest