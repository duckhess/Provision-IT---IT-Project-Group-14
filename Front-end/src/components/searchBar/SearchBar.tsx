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

          console.log("input:", value);           // what the user typed
            console.log("allCompanies:", allCompanies); // full list fetched from backend
            console.log("filtered:", filtered);     // the suggestions based on input

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

    // const handleSearchClick = () => {


    //     const filtered = input.trim() === ""
    //         ? allCompanies
    //         : allCompanies.filter((c) =>
    //             c.companyName.toLowerCase().includes(input.toLowerCase())
    //             );

    //     setSearchResults(filtered); 
    //     setSuggested([]);// only update dashboard
    // };

    // const handleClick = () => {
    //     const trimmedInput = input.trim();

    //     // If a custom search handler is provided (like homepage navigation)
    //     if (handleSearchClick) {
    //         handleSearchClick(trimmedInput); // e.g., navigate to search page
    //         setSuggested([]);               // hide dropdown after search
    //         return;
    //     }

    //     // Default behavior: filter companies for the dashboard (search page)
    //     const filtered = trimmedInput === ""
    //         ? allCompanies              // show all companies if input is blank
    //         : allCompanies.filter(c =>
    //             c.companyName.toLowerCase().includes(trimmedInput.toLowerCase())
    //         );

    //     setSearchResults(filtered);  // update SearchDashboard
    //     setSuggested([]);            // hide dropdown
    // };

    // const performSearch = (value: string) => {
    //     setInput(value);

    //     let filtered: Company[];

    //     if (value.trim() === "") {
    //         // Show all companies when input is empty
    //         filtered = allCompanies;
    //     } else {
    //         filtered = allCompanies.filter((company) =>
    //         company.companyName.toLowerCase().includes(value.toLowerCase())
    //         );
    //     }

    //     setResults(filtered);
    // };

    // const handleSearchClick = () => {
    //     performSearch(input);
    // }

    // use this when the backend is ready with query
    // const fetchData = (value:string) => {
    //     fetch(`http://local_host:3000/company?search=${encodeURIComponent(value)}`)
    //     .then ((response)=>response.json())
    //     .then((json: Company[])=> setResults(json));
    // }

    // handling input changed by setting the input then fetch data
    // const handleChange = (value : string) => {
    //     setInput(value);
    //     fetchData(value);
    // };

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
            onClick = {handleClick}></FaSearch>
        </div>
    );
};