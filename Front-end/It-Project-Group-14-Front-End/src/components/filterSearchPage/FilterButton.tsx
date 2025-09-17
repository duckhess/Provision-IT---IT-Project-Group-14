import React from 'react'
import { HiPlus } from 'react-icons/hi'

type FilterButtonProps = {
    onClick:() => void
}

const FilterButton:React.FC<FilterButtonProps> = ({onClick}) => {
  return (
    <div>
        <button 
        onClick={onClick}
        className='flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-200'>
            <HiPlus className='text-xl'>
            </HiPlus>
            Add filters
        </button>
    </div>
  )
}

export default FilterButton