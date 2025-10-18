import { Link } from "react-router-dom";
import {useState, useEffect} from "react";
import axios from "axios";

type Company = {
  companyId : number;
  companyName : string;
}

interface BackendCompanyData {
  CompanyID: number;
  CompanyName: string;
  Industry: string;
  IndustryID: number;
  ApplicationID: number;
  YearEstablished: string;
  Location: string;
  UsageOfFunds: string;
  Amount: string;
  EnvironmentalScore: number;
  SocialScore: number;
  ShortGeneralDescription: string;
  LongGeneralDescription: string;
  ShortApplicationDescription: string;
  LongApplicationDescription: string;
}

type CompanyInfo = {
    title: string,
    category: string,
    description: string,
    funding: string,
    useOfFunds: string,
    imageUrl: string
}

const Summary: React.FC<{company: Company}> = ({company}) => {
  const[companyInfo, setCompanyInfo]=useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState<boolean> (false);
  
    useEffect (() => {
        const fetchCompanies = async (id : number) => {
          try {
            setLoading(true);
            const response = await axios.get<BackendCompanyData[]> (
              `/api/company_data?CompanyID=${id}`
            );
  
          console.log("Backend reponse", response.data);
          
          // response is parsed as an array
          if (response.data.length == 1) {
            const firstCompany = response.data[0];
            setCompanyInfo({
              title : firstCompany.CompanyName,
              category : firstCompany.Industry,
              description : firstCompany.ShortGeneralDescription,
              funding : firstCompany.Amount,
              useOfFunds : firstCompany.UsageOfFunds,
              imageUrl : "random"
            });
           
          } else {
            setCompanyInfo({
              title : "no company name",
              category : "no industry category",
              description : "no company description",
              funding : "funding is missing",
              useOfFunds : "no usage of funds",
              imageUrl : ""
            });
          }
  
          } catch (err){
            console.error("error fetching companies data",err);
          } finally {
            setLoading(false);
          }
        };
        fetchCompanies(company.companyId);
      }, [company.companyId]);
  
      useEffect(() => {
    console.log("CompanyCardDetails updated:", companyInfo);
  }, [companyInfo]);



  return (
    !companyInfo ? (
      <p> Loading company info ...</p>
    ) : (

       <div className="grid [grid-template-rows:60%_40%] h-[500px] w-full  bg-white rounded-[15px]">

      {/*Image*/}
      <div className="relative w-100% h-full object-fill overflow-hidden aspect-auto rounded-[15px]">
        <img src={companyInfo.imageUrl} className="w-full h-full rounded-[15px]" alt={companyInfo.title} />

        {/*Black Border Around Company's Name*/}
        <div className = "absolute h-full max-h-[50px] min-h-[50px] w-full  bg-[black] opacity-[20%] z-20 rounded-br-[15px] rounded-bl-[15px] bottom-[0%]"></div>
          <p className="absolute font-bold text-left text-white z-30 text-[170%] left-[10px] bottom-[2.5%]">
            {companyInfo.title}
          </p>
      </div>

      {/*Summary Text Box*/}
      <div className="relative w-full h-full grid [grid-template-columns:80%_20%] bg-white rounded-[15px]">
        <div>
          <p className="relative mt-[5px] left-[10px] mb-3 text-lg text-black md:text-xl z-30 dark:text-black text-left">{companyInfo.category}</p>
          <p className="relative text-left text-gray-500 dark:text-gray-400 left-[10px]  mb-1 italic"> {companyInfo.description}</p>
          <p className="relative text-left text-gray-500 dark:text-gray-400 left-[10px]  mb-1 italic">Funding needed: {companyInfo.funding}</p>
          <p className="relative text-gray-500 dark:text-gray-400 left-[10px]  text-left mb-1 italic">Use of Funds: {companyInfo.useOfFunds}</p>
        </div>
        <div className="absolute bottom-5 right-2">
          <Link
              to={`/business/${company.companyId}`}
              className="mt-4 px-3 py-1 w-fit bg-blue-400 text-white rounded-md text-sm hover:bg-blue-500 text-center z-50"
            >
              View More
            </Link>
        </div>
      
      </div>
      
    </div>
    )
   
  );
};

export default Summary;