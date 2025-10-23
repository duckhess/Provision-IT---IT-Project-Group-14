import React,{useState, useRef, useEffect} from 'react'

type DropdownFilterProps = {
    title : string
    options : string[]
    value: string
    onChange : (value: string) =>void
}

const DropdownFilter:React.FC<DropdownFilterProps>= ({title, options, value, onChange }) => {
  
    //const [selected, setSelected] = useState("")
    const [open, setOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() =>{
        const handleClickOutside = (event : MouseEvent) => {
            if(dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleChange = (value:string) => {
        //setSelected(value)
        setOpen(false)
        if(onChange) onChange(value)
    }

    const handlePlacholderClick = () => {
        //setSelected("")
        setOpen(false)
        if(onChange) onChange("")
    }

    return (
    <div className='flex flex-col mb-4 relative' ref = {dropdownRef}>
        <label className='mb-2 font-medium'>{title}</label>

        <div className = "border border-gray-300 rounded-lg px-3 py-2 cursor-pointer relative bg-white"
            onClick = {() => setOpen(!open)}>
                {value || `Select ${title.toLocaleLowerCase()}`}
        </div>

        {open && (
            < div   
              className = "absolute mt-1 w-full max-h-36 overflow-y-auto border border-gray-300 rounded-lg bg-white z-10 shadow-lg">

                <div
                  className='px-3 py-2 hover:bg-gray-100 cursor-pointer'
                  onClick = {handlePlacholderClick}>

                  Select {title.toLowerCase()}    
                </div>

                {options.map((option)=>(
                <div
                  key = {option}
                  className='px-3 py-2 hover:bg-gray-100 cursor-pointer'
                  onClick = {()=>handleChange(option)}>
                  
                  {option} 
                </div> 
            ))}
            
            </div>
        )}

    </div>
  ) 

}

export default DropdownFilter