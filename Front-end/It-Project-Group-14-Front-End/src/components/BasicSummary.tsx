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
    <div className="grid [grid-template-rows:70%_30%] h-full min-h-[328px] max-h-[329px] w-full min-w-[513px] max-w-[513px] bg-white rounded-[15px]">

      {/*Image*/}
      <div className="relative w-full h-full object-fill">
        <img src={company.imageUrl} className="w-full h-full rounded-[15px]" alt={company.title} />

        {/*Black Border Around Company's Name*/}
        <div className = "absolute h-full max-h-[50px] min-h-[50px] w-full min-w-[513px] max-w-[513px] bg-[black] opacity-[20%] z-20 rounded-br-[15px] rounded-bl-[15px] bottom-[0%]"></div>
        <p className="absolute font-bold text-left text-white z-30 text-[170%] left-[10px] bottom-[2.5%]">
          {company.title}
        </p>
      </div>

      {/*Summary Text Box*/}
      <div className="relative w-full h-full">
        <div className="bg-white rounded">
          <p className="relative mt-[5px] left-[10px] mb-3 text-lg text-black md:text-xl z-30 dark:text-black text-left max-w-[80%]">{company.category}</p>
          <p className="relative text-left text-gray-500 dark:text-gray-400 left-[10px] max-w-[80%] mb-1 italic"> {company.description}</p>
          <p className="relative text-left text-gray-500 dark:text-gray-400 left-[10px] max-w-[80%] mb-1 italic">Funding needed: {company.funding}</p>
          <p className="relative text-gray-500 dark:text-gray-400 left-[10px] max-w-[80%] text-left mb-1 italic">Use of Funds: {company.useOfFunds}</p>
        </div>
      </div>
      
    </div>
  );
};

export default Summary;