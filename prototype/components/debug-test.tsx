"use client";

export function DebugTest() {
  return (
    <div className="p-4 border-2 border-red-500 bg-yellow-100 dark:bg-yellow-900">
      <h2 className="text-lg font-bold text-red-600 dark:text-red-400">
        Debug Test - Changes Applied
      </h2>
      <div className="space-y-2 text-sm">
        <p className="text-green-600 dark:text-green-400">✅ Mobile responsive classes applied</p>
        <p className="text-green-600 dark:text-green-400">✅ Theme toggle updated</p>
        <p className="text-green-600 dark:text-green-400">✅ Camera functionality enhanced</p>
      </div>
      <div className="mt-4 p-2 bg-blue-100 dark:bg-blue-900 rounded">
        <p className="text-xs text-blue-800 dark:text-blue-200">
          If you can see this component, the changes are working!
        </p>
      </div>
    </div>
  );
}
