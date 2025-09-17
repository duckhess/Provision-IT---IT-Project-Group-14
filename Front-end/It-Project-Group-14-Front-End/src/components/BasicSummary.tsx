const Summary = () => {

  return (


    // A wrapper for two sections; Image and Summary Text Box
    <div className="grid [grid-template-rows:70%_30%] h-full max-h-[545px] min-h-[138px] w-full max-w-[840px] min-w-[210px] bg-white rounded-[15px]">

      {/*Image*/}
      <div className="relative w-full h-full">
        <img src="Test_Image/Organic.jpg" className="w-full h-full rounded-[15px]" alt="Missing Image" />

        {/*Black Border Around Company's Name*/}
        <div className = "absolute h-full max-h-[50px] min-h-[12.5px] w-full max-w-[840px] min-w-[210px] bg-[black] opacity-[20%] z-20 rounded-br-[15px] rounded-bl-[15px] bottom-[0%]"></div>
        <p className="absolute font-bold text-left text-white z-30 text-[170%] left-[10px] bottom-[2.5%]">
          Home of Organic (Est. 2020, 5 Years)
        </p>
      </div>

      {/*Summary Text Box*/}
      <div className="relative w-full h-full">
        <div className="bg-white rounded">
          <p className="relative mt-[5px] left-[10px] mb-3 text-lg text-black md:text-xl z-30 dark:text-black text-left max-w-[80%]">Agriculture / Food</p>
          <p className="relative text-left text-gray-500 dark:text-gray-400 left-[10px] max-w-[80%] mb-1 italic"> Fresh, chemical free produce from farm to table.</p>
          <p className="relative text-left text-gray-500 dark:text-gray-400 left-[10px] max-w-[80%] mb-1 italic">Funding needed: $750k.</p>
          <p className="relative text-gray-500 dark:text-gray-400 left-[10px] max-w-[80%] text-left mb-1 italic">Use of Funds: Expand greenhouse tech.</p>
        </div>
      </div>
      
    </div>
  );
};

export default Summary;