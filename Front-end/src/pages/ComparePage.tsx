// src/pages/ComparePage.tsx
import React from "react";
import SearchBarComponent from "../components/searchBar/SearchBarComponent";
import FilterComparisonPage from "../components/ComparisonPageComponents/FilterComparisonPage";


const ComparePage: React.FC = () => {

  return (
    <main className="min-h-screen bg-#f7f7f7">
      {/* Container: centered, with top spacing to line up under fixed nav (pt-20) */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-20">
        {/* Page title */}
        <header className="text-center mb-8">
          <h1 className="text-2xl font-semibold">Let’s Compare…</h1>
        </header>

        {/* Grid: two equal columns on md+ screens; single column on small screens */}
        <div className = "grid grid-rows-[10%_90%]">
          <div className="grid grid-cols-2">
            {/* ----- LEFT COLUMN (Company 1) ----- */}

            <section className="space-y-6 items-center">
              {/* Selection button + Company 1 search (fills remaining width of column) */}
              <div className="flex items-center gap-4">
                <div className="flex-grow">
                  <SearchBarComponent/>
                </div>
              </div>

            </section>

            {/* ----- RIGHT COLUMN (Company 2) ----- */}
            <section className="space-y-6 items-center">
              {/* Spacer to align input with left column's search (keeps inputs visually lined up) */}
              <div className="flex items-center gap-4">
                <div className="flex-grow">
                  <SearchBarComponent/>
                </div>
              </div>
            </section>
          </div>
            <FilterComparisonPage/>
        </div>
        
      </div>
      
    </main>
  );
};

export default ComparePage;