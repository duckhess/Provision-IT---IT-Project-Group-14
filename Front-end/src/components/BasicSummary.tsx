import { Link } from "react-router-dom";

type Company = {
    id: number,
    title: string,
    category: string,
    description: string,
    funding: string,
    useOfFunds: string,
    imageUrl: string
}

const Summary: React.FC<{company: Company}> = ({company}) => {

  return (

    // A wrapper for two sections; Image and Summary Text Box
    <div className="grid [grid-template-rows:60%_40%] h-[329px] w-full  bg-white rounded-[15px]">

      {/*Image*/}
      <div className="relative w-100% h-full object-fill overflow-hidden aspect-auto rounded-[15px]">
        <img src={company.imageUrl} className="w-full h-full rounded-[15px]" alt={company.title} />

        {/*Black Border Around Company's Name*/}
        <div className = "absolute h-full max-h-[50px] min-h-[50px] w-full  bg-[black] opacity-[20%] z-20 rounded-br-[15px] rounded-bl-[15px] bottom-[0%]"></div>
          <p className="absolute font-bold text-left text-white z-30 text-[170%] left-[10px] bottom-[2.5%]">
            {company.title}
          </p>
      </div>

      {/*Summary Text Box*/}
      <div className="relative w-full h-full grid [grid-template-columns:80%_20%] bg-white rounded-[15px]">
        <div>
          <p className="relative mt-[5px] left-[10px] mb-3 text-lg text-black md:text-xl z-30 dark:text-black text-left">{company.category}</p>
          <p className="relative text-left text-gray-500 dark:text-gray-400 left-[10px]  mb-1 italic"> {company.description}</p>
          <p className="relative text-left text-gray-500 dark:text-gray-400 left-[10px]  mb-1 italic">Funding needed: {company.funding}</p>
          <p className="relative text-gray-500 dark:text-gray-400 left-[10px]  text-left mb-1 italic">Use of Funds: {company.useOfFunds}</p>
        </div>
        <div className="absolute bottom-5 right-2">
          <Link
              to={`/business/${company.id}`}
              className="mt-4 px-3 py-1 w-fit bg-gray-800 text-blue-400 rounded-md text-sm hover:bg-gray-700 text-center z-50"
            >
              View More
            </Link>
        </div>
          
      
      </div>
      
    </div>
  );
};

export default Summary;