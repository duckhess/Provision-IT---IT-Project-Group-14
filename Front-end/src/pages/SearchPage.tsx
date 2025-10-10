import React from "react";
import SearchBarComponent from "../components/searchBar/SearchBarComponent";
import FilterSearchPage from "../components/filterSearchPage/FilterSearchPage";
import SearchDashboard from "../components/SearchDashboard";

const SearchPage: React.FC = () => {
  return (
    <main className="w-full max-w-7xl mx-auto py-20 space-y-12 px-20">

      {/* Search Bar Section */}
      <section className = "align-middle">
        <hr className="my-4 border-t border-gray-600" />

        <div className="flex gap-4 items-center">
          {/* Search Bar */}
          <SearchBarComponent/>
          
          {/* Filter Button */}
          <FilterSearchPage/>
        </div>

        <hr className="my-6 border-t border-gray-600" />
      </section>
      <section className="align-middle h-[65%]">
        <SearchDashboard/>
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