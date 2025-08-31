import {
  ConditionalGroupDemo,
  FieldArrayDemo,
  FieldDemo,
} from '@/components/forms/fields'
import { ProgressNavigationDemo } from '@/components/forms/multi-step'

export default function TestPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="font-bold text-4xl text-gray-900 dark:text-gray-100">
            Field Components Demo
          </h1>
          <p className="text-gray-600 text-lg dark:text-gray-400">
            Testing the core field components with TanStack Forms integration
          </p>
        </div>

        <div className="space-y-8">
          <FieldDemo />

          <div className="border-t pt-8">
            <h2 className="mb-4 font-bold text-2xl text-gray-900 dark:text-gray-100">
              FieldArray Demo - Dynamic Subsidiaries
            </h2>
            <FieldArrayDemo />
          </div>

          <div className="border-t pt-8">
            <h2 className="mb-4 font-bold text-2xl text-gray-900 dark:text-gray-100">
              ConditionalGroup Demo - Conditional Field Rendering
            </h2>
            <ConditionalGroupDemo />
          </div>

          <div className="border-t pt-8">
            <h2 className="mb-4 font-bold text-2xl text-gray-900 dark:text-gray-100">
              Progress & Navigation Demo - Multi-Step Form Controls
            </h2>
            <ProgressNavigationDemo />
          </div>
        </div>
      </div>
    </div>
  )
}
