// src/pages/ComparePage.tsx
import React from "react";

/* Simple search input with a search button inside the right edge */
const SearchInput: React.FC<{ placeholder: string }> = ({ placeholder }) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        className="w-full h-10 rounded-md bg-gray-100 px-4 pr-12 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <button
        type="button"
        aria-label="Search"
        className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-md bg-gray-200 hover:bg-gray-300"
      >
        <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="6" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </div>
  );
};

/* Card that will contain each chart + title + small meta text */
const ChartCard: React.FC<{ title: string }> = ({ title }) => {
  return (
    <article className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-sm font-semibold mb-4">{title}</h3>

      <div className="bg-gray-50 rounded-md h-56 flex items-center justify-center text-gray-400">
        [Chart placeholder]
      </div>

      <p className="text-xs text-gray-500 mt-4">Sample metric • details</p>
    </article>
  );
};

const ComparePage: React.FC = () => {
  const demoCards = [
    "Current Ratio",
    "Return on Total Assets",
    "Current Ratio (Trend)",
    "EBITDA Margin",
  ];

  return (
    <main className="min-h-screen bg-#f7f7f7">
      {/* Container: centered, with top spacing to line up under fixed nav (pt-20) */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-20">
        {/* Page title */}
        <header className="text-center mb-8">
          <h1 className="text-2xl font-semibold">Let’s Compare…</h1>
        </header>

        {/* Grid: two equal columns on md+ screens; single column on small screens */}
        <div className="grid gap-8 md:[grid-template-columns:auto_1fr_1fr]">
          {/* ----- LEFT COLUMN (Company 1) ----- */}

          <section className="flex flex-col items-center space-y-6">
            <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md shadow-sm">
                ▶ Selection
              </button>
          </section>

          <section className="space-y-6 items-center">
            {/* Selection button + Company 1 search (fills remaining width of column) */}
            <div className="flex items-center gap-4">
              <div className="flex-grow">
                <SearchInput placeholder="[Company 1]" />
              </div>
            </div>

            {/* Cards stacked vertically for left column */}
            <div className="space-y-6">
              {demoCards.map((t) => (
                <ChartCard key={`left-${t}`} title={t} />
              ))}
            </div>
          </section>

          {/* ----- RIGHT COLUMN (Company 2) ----- */}
          <section className="space-y-6 items-center">
            {/* Spacer to align input with left column's search (keeps inputs visually lined up) */}
            <div className="flex items-center gap-4">
              <div className="flex-grow">
                <SearchInput placeholder="[Company 2]" />
              </div>
            </div>

            {/* Cards stacked vertically for right column */}
            <div className="space-y-6">
              {demoCards.map((t) => (
                <ChartCard key={`right-${t}`} title={t} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ComparePage;
