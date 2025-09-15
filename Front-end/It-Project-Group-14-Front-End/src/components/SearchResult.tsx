import React from 'react'

import "./SearchResult.css"

type Company = {
    id : number;
    name : string;
}

type SearchResultProps = {
    result : Company;
}

export const SearchResult: React.FC<SearchResultProps> = ({result}) => {
    return (
        <div className='search-result'
        onClick={() => alert(`You click on ${result.name}`)}
        >
        {result.name}
        </div>
    );
};