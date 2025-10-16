import React from 'react'
import {FaLeaf, FaThumbsDown, FaThumbsUp, FaUsers, FaHandPaper} from "react-icons/fa"


interface EGSScoreProps {
    social : number;
    environment : number;
}


const EGSScoreSmall : React.FC<EGSScoreProps> = ({social, environment}) => {
        
    const getScoreColor = (score : number) => {
        if (score >= 75) return "text-green-600";
        if (score >= 50) return "text-yellow-500";
        return "text-red-500";
    };

    const getThumbIcon = (score : number) =>{
        if (score >= 75) return <FaThumbsUp className='text-green-600 text-xl' title='Good'/>;
        if (score >= 50) return <FaHandPaper className='text-yellow-600 text-xl' title='Good'/>;
        return <FaThumbsDown className='text-red-500 text-xl'/>;
    }


  return (
    <div className="flex flex-col items-start w-[75%] h-[400px] bg-gray-100 rounded-lg shadow p-4">
        <h2 className='text-xl font-bold mb-4'> Environment and Social Score </h2>

        <div className='grid grid-rows-2 gap-4 w-full h-full'>
            {/*Environment */}
            <div className=' bg-white rounded-lg p-4 shadow-md flex items-center justify-between'>
                <div className='flex items-center gap-1'>
                    <FaLeaf className='text-green-500 text-3xl' />
                    <span className = "font-semibold text-gray-700 ml-3">Environemnt </span>
                </div>

                <div className='flex items-center gap-2'>
                    <span className = {`text-xl font-bold ${getScoreColor(environment)}`}>{environment}</span>
                    <span className = "ml-3">{getThumbIcon(environment)}</span>
                </div>
            </div>

            {/* Social */}
            <div className=' bg-white rounded-lg p-4 shadow-md flex items-center justify-between'>
                <div className='flex items-center gap-1'>
                    <FaUsers className='text-blue-500 text-3xl' />
                    <span className = "font-semibold text-gray-700 ml-3">Social </span>
                </div>

                <div className='flex items-center gap-2'>
                    <span className = {`text-xl font-bold ${getScoreColor(social)}`}>{social}</span>
                    <span className = "ml-3">{getThumbIcon(social)}</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default EGSScoreSmall
