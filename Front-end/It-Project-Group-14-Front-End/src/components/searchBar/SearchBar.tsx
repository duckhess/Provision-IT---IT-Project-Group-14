import React, {useState} from "react";

import { FaSearch } from "react-icons/fa";

export type Company = {
    id: number;
    name: string;
}

type SearchBarProps = {
    setResults : React.Dispatch<React.SetStateAction<Company[]>>;
}

export const SearchBar: React.FC<SearchBarProps> =  ({setResults}) =>{
    const [input, setInput] = useState("");

    // fetch data from API (need to be changed)
    // use this when the back-end query isnt set up yet
    const fetchData = (value : string) => {
        fetch("https://jsonplaceholder.typicode.com/users")
        .then((response) => response.json())
        .then((json : Company[])=> {
            /* check is the user exist, then check is there a name then compare */
            /* can be simplified but however data isnt ready yet */
            /* filtering is usually done at backend side */
            const result = json.filter ((user) => {
                return (
                    value && 
                    user && 
                    user.name && 
                    user.name.toLowerCase().includes(value.toLocaleLowerCase())
                );
            });
            setResults(result);
        });
    };

    // use this when the backend is ready with query
    // const fetchData = (value:string) => {
    //     fetch(`http://local_host:3000/company?search=${encodeURIComponent(value)}`)
    //     .then ((response)=>response.json())
    //     .then((json: Company[])=> setResults(json));
    // }

    // handling input changed by setting the input then fetch data
    const handleChange = (value : string) => {
        setInput(value);
        fetchData(value);
    };

    // input is handled when there is a new character typed
    return(
    <div className="w-full flex just mt-10">
        <div className="flex items-center w-full max-w-[1180px] min-w-[300px] h-10 px-4 bg-white rounded-lg shadow gap-1">
            <input 
            placeholder="Type to search..." 
            value = {input} 
            onChange={(e =>handleChange(e.target.value))}
            className="w-full h-full ml-1 bg-transparent border-0 text-xl focus:outline-none">
            </input>
            <FaSearch id = "search-icon"
            className="cursor-pointer text-gray-500"
            onClick = {()=>alert(`You have clicked search icon`)}></FaSearch>
        </div>
    </div>
    );
};