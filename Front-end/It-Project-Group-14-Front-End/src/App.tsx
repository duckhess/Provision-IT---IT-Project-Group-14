import { useState } from 'react'
//import './App.css'
import './index.css';
import { SearchBar } from './components/searchBar/SearchBar'
import { SearchResultList } from './components/searchBar/SearchResultList';
import FilterSearchPage from './components/filterSearchPage/FilterSearchPage';
import SideBarFilter from './components/sideBarFilter/SideBarFilter';

  type Company = {
    id : number;
    name : string;
  }

  const  METRIC_DATA = [
    {id: "1", value :"Metric 1"},
    {id: "2", value :"Metric 2"},
    {id: "3", value :"Metric 3"},
  ]

function App() {
  const [results, setResults] = useState<Company[]>([]);

  const handleSelect = (e:React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value, e.target.checked);
  }

  return (
    
      <div className="w-screen h-screen bg-white flex justify-center items-start overflow-x-hidden">
        {/* Search bar and results */}
        <div className="flex flex-col items-center w-full">
          <div className='w-full max-w-[1180px] min-w-[300px] pt-[20vh] px-4'>
          <SearchBar setResults = {setResults}></SearchBar>
          <SearchResultList results = {results}></SearchResultList>
          </div>

          
          <br/>
          <div className = "flex flex-col items-center w-full">
            <FilterSearchPage></FilterSearchPage>
          </div>


          <div className = "flex flex-col items-center w-full">
            <SideBarFilter></SideBarFilter>
          </div>
          
        </div>
      </div>

  )
}

export default App
