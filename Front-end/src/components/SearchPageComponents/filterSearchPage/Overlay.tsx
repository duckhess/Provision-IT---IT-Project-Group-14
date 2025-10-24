import React from 'react'
import { FiX } from 'react-icons/fi'
import DropdownFilter from './DropdownFilter'

type AmountRange = "low" | "medium" | "high" | "";

type OverlayProps = {
    onClose: () => void
    filters : {
        industry: string
        location: string
        amountRange : AmountRange
    }
    setFilters : React.Dispatch<React.SetStateAction<{
        amountRange : AmountRange
        industry: string
        location: string
    }>>
    onApplyFilters?:()=>void;
    industryOptions : string[];
    locationOptions : string[];
}

const  Overlay : React.FC<OverlayProps>= ({onClose, filters, setFilters, onApplyFilters, industryOptions, locationOptions}) => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50'>
        <div className='relative bg-white w-96 h-96 rounded-2xl shadow-xl flex flex-col p-6'>
            {/* close button */}
            <button 
            onClick = {onClose}
            className = "absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            data-testid="closeButton">
                <FiX size={24}></FiX>
            </button>
            
            <h2 className='text-xl font-bold mb-4'>Please apply the filters below </h2>

            <DropdownFilter 
                data-testid="filterFundNeeded"
                title = "Fund Needed" 
                options = {["Below $1,500,000", "$1,500,000-$3,000,000", "Above $3,000,000"]}
                value = {
                    filters.amountRange === "low" 
                    ? "Below $1,500,000" 
                    : filters.amountRange === "medium"
                    ? "$1,500,000-$3,000,000"
                    : filters.amountRange === "high"
                    ? "Above $3,000,000"
                    : ""}
                onChange = {(val)=> 
                    setFilters(prev=> ({
                        ...prev, 
                        amountRange:
                            val === "Below $1,500,000" ? "low" :
                            val === "$1,500,000-$3,000,000" ? "medium" : 
                            val === "Above $3,000,000" ? "high" :
                            "",
                        }))
                    }>
            </DropdownFilter>

            <DropdownFilter 
                data-testid="filterIndustry"
                title = "Industry" 
                options = {industryOptions}
                value = {filters.industry}
                onChange = {(val)=>setFilters(prev=>({...prev, industry: val}))}>
            </DropdownFilter>

            <DropdownFilter 
                data-testid="filterLocation"
                title = "Location" 
                options = {locationOptions}
                value = {filters.location}
                onChange = {(val)=>setFilters(prev=>({...prev, location: val}))}>
            </DropdownFilter>

            {/* "Filter" button */}
            <div className='mt-auto flex justify-end'>
                <button 
                onClick = {()=>{
                    if(onApplyFilters) onApplyFilters();
                }}
                className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'>
                Filter
                </button>
            </div>
            
        </div>
    </div>
  )
}

export default  Overlay