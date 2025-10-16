import React from 'react'

import { SearchResult } from './SearchResult';

interface Company {
  companyId: number;
  companyName: string;
}

type SearchResultListProps = {
    results : Company[];
    onSelect : (company : Company) => void;
}

export const SearchResultList : React.FC<SearchResultListProps> = ({ results , onSelect}) => {
    if (!results || results.length === 0) return null;

    //div className= "absolute left-0 right-0 bg-white flex flex-col shadow rounded-lg mt-2 max-h-[300px] overflow-y-scroll scrollbar-hide z-50"

    return (
        <div className= "absolute w-full bg-white shadow mt-1 max-h-60 overflow-y-auto z-10">
            {results.map((company)=>(
                <SearchResult result = {company} key={company.companyId} onSelect={onSelect}></SearchResult>
            ))}
        </div>
    );
}