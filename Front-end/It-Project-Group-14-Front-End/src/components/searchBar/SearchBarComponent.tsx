import React, {useState} from 'react'
import { SearchBar } from './SearchBar';
import { SearchResultList } from './SearchResultList';

type Company = {
  id : number;
  name : string;
}

const SearchBarComponent = () => {
  const [results, setResults] = useState<Company[]>([]);

  return (

    <div className="flex flex-col items-center w-full ">
          <div className='w-full max-w-[1180px] min-w-[300px]  px-4'>
            <div className='relative w-full'>
              <SearchBar setResults = {setResults}></SearchBar>
              <SearchResultList results = {results}></SearchResultList>
            </div>
          </div>
    </div>
  )
}

export default SearchBarComponent