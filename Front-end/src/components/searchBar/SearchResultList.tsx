import React from 'react'

//import "./SearchResultList.css";
import { SearchResult } from './SearchResult';

interface Company {
  companyId: number;
  companyName: string;
}

type SearchResultListProps = {
    results : Company[];
}

export const SearchResultList : React.FC<SearchResultListProps> = ({ results }) => {
    return (
        <div className= "absolute left-0 right-0 bg-white flex flex-col shadow rounded-lg mt-2 max-h-[300px] overflow-y-scroll scrollbar-hide z-50">
            {results.map((company)=>(
                <SearchResult result = {company} key={company.companyId}></SearchResult>
            ))}
        </div>
    );
}