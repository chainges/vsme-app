export default function TestPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="font-bold text-4xl text-gray-900 dark:text-gray-100">
            Test Page
          </h1>
          <p className="text-gray-600 text-lg dark:text-gray-400">
            Ready for new implementations
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Clean Slate
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            All form components have been removed. Ready for fresh implementations!
          </p>
        </div>
      </div>
    </div>
  )
}
