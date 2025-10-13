import React, {useState, useEffect} from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

interface Company {
  companyId: number;
  companyName: string;
}

interface SearchBarProps {
    setResults : React.Dispatch<React.SetStateAction<Company[]>>;
}

export const SearchBar: React.FC<SearchBarProps> =  ({setResults}) =>{
    const [input, setInput] = useState("");
    const [allCompanies, setAllCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCompanies = async () => {
        try {
            setLoading(true);
            const response = await axios.get<Company[]>("http://localhost:5000/companies");
            setAllCompanies(response.data);
        } catch (err) {
            console.error("Error fetching companies:", err);
        } finally {
            setLoading(false);
        }
        };
        fetchCompanies();
    }, []);

    const handleChange = (value: string) => {
        setInput(value);
        if (value.trim() === "") {
        setResults([]);
        return;
        }

        const filtered = allCompanies.filter((company) =>
        company.companyName.toLowerCase().includes(value.toLowerCase())
        );
        setResults(filtered);
    };


    // // fetch data from API (need to be changed)
    // // use this when the back-end query isnt set up yet
    // const fetchData = (value : string) => {
    //     fetch("/companies/companyName")
    //     .then((response) => response.json())
    //     .then((json : Company[])=> {
    //         console.log("Fetched data : ", json);
    //         /* check is the user exist, then check is there a name then compare */
    //         /* can be simplified but however data isnt ready yet */
    //         /* filtering is usually done at backend side */
    //         const result = value 
    //              ? json.filter((company) => 
    //                 company.name
    //                 .toLowerCase()
    //                 .includes(value.toLowerCase())
    //             ) : [];
            
    //         setResults(result);
    //         console.log("Filter results", result);
    //     })
    //     .catch((err)=>console.error(err));
    // };


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
            onChange={(e =>handleChange(e.target.value))}
            className="w-full h-full ml-1 bg-transparent border-0 text-xl focus:outline-none">
            </input>

            <FaSearch id = "search-icon"
            className="cursor-pointer text-gray-500"
            onClick = {()=>alert(`You have clicked search icon`)}></FaSearch>
        </div>
    );
};