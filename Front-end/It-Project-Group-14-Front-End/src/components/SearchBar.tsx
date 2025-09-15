import React, {useState} from "react";

import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";

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
    // fetch(API)
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

    // handling input changed by setting the input then fetch data
    const handleChange = (value : string) => {
        setInput(value);
        fetchData(value);
    };

    // input is handled when there is a new character typed
    return(
    <div className="input-wrapper">
        <input 
        placeholder="Type to search..." 
        value = {input} 
        onChange={(e =>handleChange(e.target.value))}>
        </input>
        <FaSearch id = "search-icon"></FaSearch>
    </div>
    );
};