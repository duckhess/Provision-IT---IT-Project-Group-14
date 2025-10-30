import React from 'react'
import {FaLeaf,FaUsers, FaUniversity} from "react-icons/fa"
import getScoreColour from '../../../utils/getScoreColour';
import getThumbIcon from '../../../utils/getThumbIcon';


interface EGSScoreProps {
    social : number;
    environment : number;
    governance : number;
}


const EGSScoreSmall : React.FC<EGSScoreProps> = ({social, environment, governance}) => {
  return (
    <div className="flex flex-col items-start w-[75%] h-[400px] bg-gray-100 rounded-lg shadow p-4 overflow-x-hidden">
        <h2 className='text-xl font-bold mb-4'> ESG Score </h2>

        <div className='grid grid-rows-3 gap-4 w-full max-w-full h-full'>
            {/*Environment */}
            <div className=' bg-white rounded-lg p-4 shadow-md flex items-center justify-between' >
                <div className='flex items-center gap-1'>
                    <FaLeaf className='text-green-500 text-3xl' />
                    <span className = "font-semibold text-gray-700 ml-3">Environment </span>
                </div>

                <div className='flex items-center gap-2'>
                    <span className = {`text-xl font-bold ${getScoreColour(environment)}`} data-testid="envScore">{environment}</span>
                    <span className = "ml-3" data-testid="envThumb">{getThumbIcon(environment)}</span>
                </div>
            </div>

            {/* Social */}
            <div className=' bg-white rounded-lg p-4 shadow-md flex items-center justify-between' >
                <div className='flex items-center gap-1'>
                    <FaUsers className='text-blue-500 text-3xl' />
                    <span className = "font-semibold text-gray-700 ml-3">Social </span>
                </div>

                <div className='flex items-center gap-2'>
                    <span className = {`text-xl font-bold ${getScoreColour(social)}`} data-testid="socialScore">{social}</span>
                    <span className = "ml-3" data-testid="socialThumb">{getThumbIcon(social)}</span>
                </div>
            </div>

            {/* Governance */}
            <div className=' bg-white rounded-lg p-4 shadow-md flex items-center justify-between' >
                <div className='flex items-center gap-1'>
                    <FaUniversity className='text-yellow-500 text-3xl' />
                    <span className = "font-semibold text-gray-700 ml-3">Governance </span>
                </div>

                <div className='flex items-center gap-2'>
                    <span className = {`text-xl font-bold ${getScoreColour(governance)}`} data-testid="govScore">{governance}</span>
                    <span className = "ml-3" data-testid="govThumb">{getThumbIcon(governance)}</span>
                </div>
            </div>
            
        </div>
    </div>
  )
}

export default EGSScoreSmall
