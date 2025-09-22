import React from "react";
import SearchBarComponent from "../components/searchBar/SearchBarComponent";
import FilterSearchPage from "../components/filterSearchPage/FilterSearchPage";

const SearchPage: React.FC = () => {
  return (
    <main className="w-full max-w-7xl mx-auto py-20 space-y-12 px-20">

      {/* Search Bar Section */}
      <section className = "align-middle">
        <hr className="my-4 border-t border-gray-600" />

        <div className="flex gap-4 items-center">
          {/* Search Bar */}
            <SearchBarComponent></SearchBarComponent>
          
          {/* Filter Button */}
          <FilterSearchPage></FilterSearchPage>
        </div>

        <hr className="my-6 border-t border-gray-600" />
      </section>

      {/* Results Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Business Cards */}
        <div className="space-y-6">
          <div className="p-4 bg-gray-100 rounded shadow">
            <h2 className="text-lg font-semibold">Tegridy Farms</h2>
            <p className="text-sm text-gray-600">
              Tegridy Farms seeks $25,000 to purchase new tractors. Your support
              keeps our South Park fields thriving 🌱
            </p>
          </div>

          <div className="p-4 bg-gray-100 rounded shadow">
            <h2 className="text-lg font-semibold">Another Business</h2>
            <p className="text-sm text-gray-600">
              Placeholder for more businesses...
            </p>
          </div>
        </div>

        {/* Right Column: Business Details + Analytics */}
        <div className="md:col-span-2 space-y-6">
          {/* Featured Business Info */}
          <div className="p-4 bg-gray-200 rounded shadow h-40">
            <h2 className="text-xl font-bold">Tegridy Farms (Est. 2009, 16 Years)</h2>
            <p className="text-gray-600">
              Agriculture • Funding Needed: $25k • Use of Funds: Buy tractor
            </p>
            <button className="mt-4 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
              More Info
            </button>
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded shadow p-4">
              <h3 className="font-semibold">Current Ratio</h3>
              <div className="h-40 bg-gray-100 mt-2 flex items-center justify-center">
                Chart Placeholder
              </div>
            </div>

            <div className="bg-white rounded shadow p-4">
              <h3 className="font-semibold">Debt Service Cover</h3>
              <div className="h-40 bg-gray-100 mt-2 flex items-center justify-center">
                Chart Placeholder
              </div>
            </div>

            <div className="bg-white rounded shadow p-4">
              <h3 className="font-semibold">Return on Assets</h3>
              <div className="h-40 bg-gray-100 mt-2 flex items-center justify-center">
                Chart Placeholder
              </div>
            </div>

            <div className="bg-white rounded shadow p-4">
              <h3 className="font-semibold">EBITDA Margin</h3>
              <div className="h-40 bg-gray-100 mt-2 flex items-center justify-center">
                Chart Placeholder
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pagination */}
      <div className="flex justify-center gap-4">
        <button className="w-10 h-10 rounded-full bg-gray-300 hover:bg-gray-400">
          1
        </button>
        <button className="w-10 h-10 rounded-full bg-gray-300 hover:bg-gray-400">
          2
        </button>
        <button className="w-10 h-10 rounded-full bg-gray-300 hover:bg-gray-400">
          3
        </button>
      </div>
    </main>
  );
};

export default SearchPage;
