/**
 * Fallback component displayed when a requested project ID does not exist
 * or cannot be retrieved from the application state.
 */
export default function ProjectNotFound() {
  /**
   * Navigates the user back to the previous browser history entry.
   */
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col justify-center items-center p-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full text-center space-y-4">
        {/* Visual Icon / Conceptual Zen Illustration */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Background glowing circle */}
            <div className="h-24 w-24 rounded-full bg-indigo-50 flex items-center justify-center animate-pulse">
              <svg
                className="h-16 w-16 text-rose-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Face boundary */}
                <circle cx="12" cy="12" r="10" />
                {/* Left eye */}
                <path d="M8 9h.01" />
                {/* Right eye */}
                <path d="M16 9h.01" />
                {/* Sad mouth curve */}
                <path d="M15 16.5a4 4 0 0 0-6 0" />
              </svg>
            </div>
            {/* Floating warning alert pulse */}
            <span className="absolute bottom-1 right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500"></span>
            </span>
          </div>
        </div>

        {/* Main Error Heading and Subtitle */}
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight sm:text-3xl">
            Project Not Found
          </h1>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            This project does not exist in{" "}
            <span className="font-semibold text-indigo-600">Kronos</span>.
          </p>
        </div>

        {/* Diagnostic Suggestion Card */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            ¿What happened?
          </p>
          <ul className="text-sm text-slate-600 text-left space-y-2 max-w-xs mx-auto list-disc list-inside">
            <li>The project ID is incorrect.</li>
            <li>The project was deleted or archived.</li>
            <li>You do not have access to this project.</li>
          </ul>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={handleGoBack}
            className="w-full sm:w-auto inline-flex justify-center items-center px-5 py-2.5 border border-slate-300 shadow-sm text-sm font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors cursor-pointer"
          >
            Go back
          </button>

          <a
            href="/dashboard"
            className="w-full sm:w-auto inline-flex justify-center items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md shadow-indigo-100 transition-colors"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
