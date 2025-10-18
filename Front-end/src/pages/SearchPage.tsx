import React from "react";
import {useState, useEffect} from "react";
import SearchBarComponent from "../components/searchBar/SearchBarComponent";
import FilterSearchPage from "../components/filterSearchPage/FilterSearchPage";
import SearchDashboard from "../components/SearchDashboard";
import axios from "axios";
import {useLocation} from "react-router-dom";

interface Company {
  companyId: number;
  companyName: string;
}


const SearchPage: React.FC = () => {
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  // const [suggestedCompanies, setSuggestedCompanies] = useState<Company[]>([]);
  const [searchResults, setSearchResults] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query") || "";

  useEffect (() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Company[]> (
          "/api/companies"
        );
        setAllCompanies(response.data);

        // show all comapnies when there is no input in search bar 
        setSearchResults(response.data);

        console.log("all companies", response.data);
      } catch (err){
        console.error("error fetching companies data",err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  // console.log("all companies", allCompanies);
  // console.log("search result", searchResults);


  return (
    <main className="w-full max-w-7xl mx-auto py-20 space-y-12 px-20">

      {/* Search Bar Section */}
      <section className = "align-middle">
        <hr className="my-4 border-t border-gray-600" />

        <div className="flex gap-4 items-center">
          {/* Search Bar */}
          <SearchBarComponent allCompanies={allCompanies} setSearchResults = {setSearchResults}/>
          
          {/* Filter Button */}
          <FilterSearchPage/>
        </div>

        <hr className="my-6 border-t border-gray-600" />
      </section>
      <section className="align-middle h-[65%]">
        {loading ? (
          <p>Loading...</p>
        ) : (<SearchDashboard companies = {searchResults} />)}
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