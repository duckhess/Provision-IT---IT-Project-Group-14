import {useState} from 'react'
import { SearchBar } from './SearchBar';
import { SearchResultList } from './SearchResultList';

interface Company {
  companyId: number;
  companyName: string;
}

const SearchBarComponent = () => {
  const [results, setResults] = useState<Company[]>([]);

  return (
    <div className="flex items-center w-full ">
          <div className='w-full max-w-[1180px] min-w-[300px] px-4'>
            <div className='relative w-full'>
              <SearchBar setResults = {setResults}></SearchBar>
              {results.length > 0 && <SearchResultList results = {results}/>}
            </div>
          </div>
    </div>
  )
}

export default SearchBarComponent