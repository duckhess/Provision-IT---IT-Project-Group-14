import React, { useState} from 'react';
import CompanyCard from '../components/CompanyCard';
import Summary from '../components/BasicSummary';
import SearchPageGrid from './SearchPageGrid.tsx';

interface receivedCompaniesProps {
  companies: { companyId: number; companyName: string }[];
}

const SearchDashboard: React.FC<receivedCompaniesProps> = ({companies}) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  if (!companies || companies.length === 0) {
    return (
      <div className="p-6 text-gray-500">
        No companies to display. Start typing to search.
      </div>
    );
  }

  const selectedItem = companies.find((c) => c.companyId === selectedId) || null;

  return (
    <div className="flex h-full p-6">

      {/* Left panel */}
        <div className="w-1/4 pr-4 border-r overflow-y-auto">
        
        {companies && companies.length > 0 ? (
          
          companies.map((company) => (
            <CompanyCard
              key={company.companyId}
              id={company.companyId}
              companyName={company.companyName}
              onClick={setSelectedId}
              isActive={company.companyId === selectedId}
            />
          ))
        ) : (
          <p className="p-4 text-gray-500">No companies to display</p>
        )}
      </div>
      

      {/* Right panel */}
      <div className = "h-[1500px] w-3/4 pl-6 border-r pr-4">
        <div className="grid grid-rows-[500px_1000px]">
          {selectedItem ? (
            <>
              <Summary company={selectedItem} />
              <div className='overflow-y-auto'>
                <SearchPageGrid company={selectedItem} />
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center mt-20">Select a startup to see summary and metrics.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchDashboard;