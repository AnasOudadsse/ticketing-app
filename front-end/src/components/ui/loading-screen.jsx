import { LoadingSpinner } from "./loading-spinner"

export function LoadingScreen({ message = "Loading your application" }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* UM6SS Logo or Brand Element */}
        <img src="/UM6SS-logo.png" alt="UM6SS Logo" className="h-12 w-auto" />


        {/* Loading Spinner */}
        <LoadingSpinner size="lg" className="text-green-700 dark:text-blue-400" />

        {/* Loading Message */}
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{message}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Please wait while we verify your credentials</p>
        </div>
      </div>

      {/* Progress Bar Animation */}
      <div className="absolute bottom-0 left-0 w-full">
        <div className="h-1 w-full bg-gray-100 dark:bg-gray-800">
          <div className="h-1 animate-progress bg-gradient-to-r from-blue-500 to-blue-700"></div>
        </div>
      </div>
    </div>
  )
}
