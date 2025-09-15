import React from 'react'

import "./SearchResultList.css";
import { SearchResult } from './SearchResult';

type Company = {
    id : number;
    name : string;
};

type SearchResultListProps = {
    results : Company[];
}

export const SearchResultList : React.FC<SearchResultListProps> = ({ results }) => {
    return (
        <div className='results-list'>
            {results.map((company)=>(
                <SearchResult result = {company} key={company.id}></SearchResult>
            ))}
        </div>
    );
}