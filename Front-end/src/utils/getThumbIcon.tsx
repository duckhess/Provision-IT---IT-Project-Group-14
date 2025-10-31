import {FaThumbsDown, FaThumbsUp, FaHandPaper} from "react-icons/fa"

const getThumbIcon = (score : number) =>{
    if (score >= 75) return <FaThumbsUp className='text-green-600 text-xl' title='Good'/>;
    if (score >= 50) return <FaHandPaper className='text-yellow-600 text-xl' title='Good'/>;
    return <FaThumbsDown className='text-red-500 text-xl'/>;
}

export default getThumbIcon;