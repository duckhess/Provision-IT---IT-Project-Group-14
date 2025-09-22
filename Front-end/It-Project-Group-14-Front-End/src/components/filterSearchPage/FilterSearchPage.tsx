import React, { useState } from 'react'
import FilterButton from './FilterButton'
import Overlay from './Overlay'

const FilterSearchPage = () => {

    const [showOverlay, setShowOverlay] = useState(false);

    const [filters, setFilters] = useState({
        businessSize : "",
        industry : "",
        location: "",
    });

    return (
        <div>
            <FilterButton onClick={()=> setShowOverlay(true)}></FilterButton>
            {showOverlay && 
            <Overlay 
              onClose={()=>setShowOverlay(false)}
              filters = {filters}
              setFilters = {setFilters}>
            </Overlay>}
        </div>
    )
}

export default FilterSearchPage