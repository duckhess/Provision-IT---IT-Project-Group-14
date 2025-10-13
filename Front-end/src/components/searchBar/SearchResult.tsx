import React from 'react'

//import "./SearchResult.css"

interface Company {
  companyId: number;
  companyName: string;
}

type SearchResultProps = {
    result : Company;
}

export const SearchResult: React.FC<SearchResultProps> = ({result}) => {
    return (
        <div className= "px-5 py-2.5 hover:bg-gray-100 cursor-pointer w-full"
        onClick={() => alert(`You click on ${result.companyName}`)}
        >
        {result.companyName}
        </div>
    );
};