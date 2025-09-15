import { useState } from 'react'
//import './App.css'
import './index.css';
import { SearchBar } from './components/SearchBar'
import { SearchResultList } from './components/SearchResultList';

  type Company = {
    id : number;
    name : string;
  }

function App() {
  const [results, setResults] = useState<Company[]>([]);

  return (
    <>
      <div className="w-screen h-screen bg-white flex justify-center items-start">
        <div className="flex flex-col items-center w-full max-w-[1180px] min-w-[300px] pt-[20vh] px-4">
          <SearchBar setResults = {setResults}></SearchBar>
          <SearchResultList results = {results}></SearchResultList>
        </div>
      </div>
    </>
  )
}

export default App
