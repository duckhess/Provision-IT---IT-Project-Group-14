import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchBarComponent from "../components/searchBar/SearchBarComponent";
import FilterComparisonPage from "../components/ComparisonPageComponents/FilterComparisonPage";

interface Company {
  companyId: number;
  companyName: string;
}

const ComparePage: React.FC = () => {
  const [companyA, setCompanyA] = useState<Company | null>(null);
  const [companyB, setCompanyB] = useState<Company | null>(null);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetches companies [ID and Name]
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Company[]>(
          "/api/companies"
        );
        setAllCompanies(response.data);
      } catch (err) {
        console.error("Error fetching companies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f7f7]">
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-20">
        <header className="text-center mb-8">
          <h1 className="text-2xl font-semibold">Let’s Compare…</h1>
        </header>

        <div className="grid grid-cols-2 gap-8">
          {/* LEFT (Company A) */}
          <section className="space-y-6">
            <SearchBarComponent
              allCompanies={allCompanies}
              setSearchResults={(companies) => {
                if (companies.length > 0) setCompanyA(companies[0]);
              }}
            />
            {companyA && (
              <p className="text-center text-gray-700">
                Selected: {companyA.companyName}
              </p>
            )}
          </section>

          {/* RIGHT (Company B) */}
          <section className="space-y-6">
            <SearchBarComponent
              allCompanies={allCompanies}
              setSearchResults={(companies) => {
                if (companies.length > 0) setCompanyB(companies[0]);
              }}
            />
            {companyB && (
              <p className="text-center text-gray-700">
                Selected: {companyB.companyName}
              </p>
            )}
          </section>
        </div>

        <FilterComparisonPage companyA={companyA} companyB={companyB} />
      </div>
    </main>
  );
};

export default ComparePage;
