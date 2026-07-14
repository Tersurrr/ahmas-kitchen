export default function SiteLoading() {
  return (
    <div
      className="max-w-container-max mx-auto px-4 py-10 md:px-gutter"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="animate-pulse space-y-6">
        <div className="h-3 w-24 rounded bg-surface-container-high" />
        <div className="h-10 w-2/5 max-w-sm rounded bg-surface-container-high" />
        <div className="h-4 w-full max-w-xl rounded bg-surface-container-high" />
        <div className="grid grid-cols-1 gap-6 pt-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="overflow-hidden rounded-xl bg-white shadow-soft">
              <div className="aspect-[4/3] bg-surface-container-high" />
              <div className="space-y-3 p-4">
                <div className="h-5 w-3/4 rounded bg-surface-container-high" />
                <div className="h-4 w-full rounded bg-surface-container-high" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">Loading page content</span>
    </div>
  );
}
