import './index.css';
import FilterSearchPage from './components/filterSearchPage/FilterSearchPage';
import SideBarFilter from './components/sideBarFilter/SideBarFilter';
import SearchBarComponent from './components/searchBar/SearchBarComponent';





function App() {

  const handleSelect = (e:React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value, e.target.checked);
  }

  return (
    
      <div className="w-screen h-screen bg-white flex justify-center items-start overflow-x-hidden">
        {/* Search bar and results */}
        <div className = "flex flex-col items-center w-full">
          <SearchBarComponent></SearchBarComponent>

        
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
