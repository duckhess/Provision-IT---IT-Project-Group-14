import React from 'react'

//import "./SearchResult.css"

interface Company {
  companyId: number;
  companyName: string;
}

type SearchResultProps = {
    result : Company;
    onSelect : (company : Company) => void;
}

export const SearchResult: React.FC<SearchResultProps> = ({result, onSelect}) => {
    return (
        <div className= "px-5 py-2.5 hover:bg-gray-100 cursor-pointer w-full"
            onClick={()=>onSelect(result)}>
        {result.companyName}
        </div>
    );
};