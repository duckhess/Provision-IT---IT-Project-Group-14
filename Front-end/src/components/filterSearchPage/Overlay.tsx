import React from 'react'
import { FiX } from 'react-icons/fi'
import DropdownFilter from './DropdownFilter'

type OverlayProps = {
    onClose: () => void
    filters : {
        businessSize:string
        industry: string
        location: string
    }
    setFilters : React.Dispatch<React.SetStateAction<{
        businessSize: string
        industry: string
        location: string
    }>>
}

const  Overlay : React.FC<OverlayProps>= ({onClose, filters, setFilters}) => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50'>
        <div className='relative bg-white w-96 h-96 rounded-2xl shadow-xl flex flex-col p-6'>
            {/* close button */}
            <button 
            onClick = {onClose}
            className = "absolute top-3 right-3 text-gray-500 hover:text-gray-700">
                <FiX size={24}></FiX>
            </button>
            
            <h2 className='text-xl font-bold mb-4'>Please apply the filters below </h2>

            <DropdownFilter 
                title = "Business Size" 
                options = {['Small', 'Medium', 'Large']}
                value = {filters.businessSize}
                onChange = {(val) => setFilters(prev => ({...prev, businessSize: val}))}>
            </DropdownFilter>

            <DropdownFilter 
                title = "Industry" 
                options = {["Household", "Real Estate","Food Processing","Advertising"]}
                value = {filters.industry}
                onChange = {(val) => setFilters(prev => ({...prev, industry: val}))}>
                </DropdownFilter>
            <DropdownFilter 
                title = "Location" 
                options = {["Sydney", "Melbourne", "Brisbane", "Tasmania"]}
                value = {filters.location}
                onChange = {(val) => setFilters(prev => ({...prev, location: val}))}>
            </DropdownFilter>

            {/* "Filter" button */}
            <div className='mt-auto flex justify-end'>
                <button 
                onClick = {onClose}
                className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'>
                Filter
                </button>
            </div>
            
        </div>
    </div>
  )
}

export default  Overlay