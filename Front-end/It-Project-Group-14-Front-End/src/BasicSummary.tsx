import "./BasicSummary.css"

const Summary = () => {

  return (
    <div className="wrapper">
      <div className="image-wrapper">
        <img src="Test_Image/Organic.jpg" alt="Missing Image" className="image"/>
        <div className="text-border"></div>
        <h1 className="image-text">Home of Organic (Est. 2020, 5 Years)</h1>
      </div>
      <div className="text-box">
        <br/>
           <p className="mb-3 text-lg text-black md:text-xl dark:text-black">Agriculture / Food</p>
           <div className = "text-left">
            <p className="text-gray-500 dark:text-gray-400 pl-2"> Fresh, chemical free produce from farm to table.</p>
            <p className="text-gray-500 dark:text-gray-400">Funding needed: $750k.</p>
            <p className="text-gray-500 dark:text-gray-400">Use of Funds: Expand greenhouse tech.</p>
           </div>
      </div>
    </div>
  );
};

export default Summary;