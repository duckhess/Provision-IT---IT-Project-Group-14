import { useState } from 'react'
import './App.css'
import { SearchBar } from './components/SearchBar'
import { SearchResultList } from './components/SearchResultList';

function App() {

  type Company = {
    id : number;
    name : string;
  }

  const [results, setResults] = useState<Company[]>([]);

  return (
    <>
      <div className='App'>
        <div className='search-bar-container'>
          <SearchBar setResults = {setResults}></SearchBar>
          <SearchResultList results = {results}></SearchResultList>
        </div>
      </div>
    </>
  )
}

export default App
