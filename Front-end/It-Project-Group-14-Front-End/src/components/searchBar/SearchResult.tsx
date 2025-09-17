import React from 'react'

//import "./SearchResult.css"

type Company = {
    id : number;
    name : string;
}

type SearchResultProps = {
    result : Company;
}

export const SearchResult: React.FC<SearchResultProps> = ({result}) => {
    return (
        <div className= "px-5 py-2.5 hover:bg-gray-100 cursor-pointer w-full"
        onClick={() => alert(`You click on ${result.name}`)}
        >
        {result.name}
        </div>
    );
};