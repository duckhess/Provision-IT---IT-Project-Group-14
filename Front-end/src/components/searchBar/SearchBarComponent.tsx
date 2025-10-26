import { SearchBar } from './SearchBar';
import { SearchResultList } from './SearchResultList';
import { useState } from 'react';

interface Company {
  companyId: number;
  companyName: string;
}

type SearchBarComponentProps = {
  allCompanies: Company[];
  setSearchResults: (companies: Company[]) => void;
  handleSearchClick? : (input : string) => void;
};

const SearchBarComponent : React.FC <SearchBarComponentProps> = ({allCompanies, setSearchResults, handleSearchClick }) => {
  const [suggestedCompanies, setSuggestedCompanies] = useState<Company[]>([]);

  return (
    <div className="flex items-center w-full ">
          <div className='w-full max-w-[1180px] min-w-[300px] px-4'>
            <div className='relative w-full'>
              <SearchBar
                allCompanies={allCompanies}
                setSuggested={setSuggestedCompanies}
                setSearchResults={setSearchResults}
                handleSearchClick = {handleSearchClick}
              />
              <SearchResultList
                results={suggestedCompanies}
                onSelect={(company) => {
                  setSearchResults([company]); 
                  setSuggestedCompanies([]); 
                }}
              />
            </div>
          </div>
    </div>
  )
}

export default SearchBarComponent