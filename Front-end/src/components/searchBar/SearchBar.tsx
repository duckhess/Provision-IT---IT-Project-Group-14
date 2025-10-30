import React, {useState} from "react";

import { FaSearch } from "react-icons/fa";

interface Company {
  companyId: number;
  companyName: string;
}

type SearchBarProps = {
  allCompanies: Company[];
  setSuggested: (companies: Company[]) => void;
  setSearchResults: (companies: Company[]) => void;
  handleSearchClick? : (input : string) => void;
}

export const SearchBar: React.FC<SearchBarProps> =  ({allCompanies, setSuggested, setSearchResults, handleSearchClick}) =>{
    const [input, setInput] = useState("");

    const handleChange = (value: string) => {
        setInput(value);

        // update suggested list as user types
        const filtered = value.trim() === ""
            ? []
            : allCompanies.filter((c) =>
                c.companyName.toLowerCase().includes(value.toLowerCase())
                );

        setSuggested(filtered);
    };

    const handleClick = () => {
        const trimmedInput = input.trim();

        if(handleSearchClick){
            handleSearchClick(trimmedInput);
            setSuggested([]);
            return;
        }

        const filtered = input.trim() === ""
            ? allCompanies
            : allCompanies.filter((c) =>
                c.companyName.toLowerCase().includes(input.toLowerCase())
                );

        setSearchResults(filtered); 
        setSuggested([]);// only update dashboard

    }

    // input is handled when there is a new character typed
    return(
        <div className="flex items-center w-full max-w-[1180px] min-w-[300px] h-12 px-4 bg-white rounded-lg shadow gap-2">
            <input 
            placeholder="Type to search..." 
            value = {input} 
            onChange={(e) =>handleChange(e.target.value)}
            className="w-full h-full ml-1 bg-transparent border-0 text-xl focus:outline-none">
            </input>

            <FaSearch id = "search-icon"
            className="cursor-pointer text-gray-500"
            onClick = {handleClick}
            data-testid="search-icon"></FaSearch>
        </div>
    );
};