import React, { use, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FilterBusinessPage from "../components/filterBusinessPage/FilterBusinessPage";
import axios from "axios";

interface Company {
  id : number;
  name: string;
}

interface CompanyData extends Company{
  companyLongDescription: string;
  projectLongDescription : string;
  companyImageUrl : string;
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

const BusinessPage: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  console.log("Company ID from url: ", companyId);

  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const {data} = await axios.get<BackendCompanyData[]>(
          `/api/company_data?companyID=${companyId}`
        );

        const companyNeeded = data[0];
        if(!companyNeeded) {
          setCompany(null);
          return;
        }

        const mapped : CompanyData = {
          id : companyNeeded.CompanyID,
          name : companyNeeded.CompanyName,
          companyLongDescription : companyNeeded.LongGeneralDescription,
          projectLongDescription : companyNeeded.LongApplicationDescription,
          companyImageUrl:`/Pic/${companyNeeded.CompanyID}_image.jpg`
        };

        setCompany(mapped);
      } catch (err) {
        console.error("error fetching company data", err);
        setCompany(null);
      }
    };

    if(companyId) fetchCompany();
  }, [companyId]);


  // useEffect(() => {
  //   // Simulate API fetch by finding from dummy data
  //   const fetchCompany = async () => {
  //     try {
  //       const data = dummyCompanies.find((c) => c.id === companyId);
  //       setCompany(data || null);
  //     } catch (err) {
  //       console.error("Error fetching company data:", err);
  //     }
  //   };

  //   fetchCompany();
  // }, [companyId]); // only depend on companyId

  if (!company) return <p className="text-center py-12">Loading...</p>;

  const parts = company.projectLongDescription.split("•").map(p=>p.trim()).filter(Boolean);

  const normalText = parts.length > 0 ? parts[0] : "";
  const bulletPoints = parts.length > 1?parts.slice(1) : [];

  return (
    <main className="max-w-4xl mx-auto py-20 px-6 text-center">

      {/* Company description */}
      <section className="py-8 px-4">
        <div className = "grid grid-cols-1 md:grid-cols-[60%_40%] gap-8 items-start">

          {/*Left column = company info */}
          <div className="text-left">
            <p className="text-3xl mb-2">Hello, we are</p>
            <h1 className="text-4xl font-bold mb-4">{company.name}</h1>
            <p className="text-gray-800 mb-6">{company.companyLongDescription}</p>
            <div className="text-gray-800 my-2">
              {/* {company.projectLongDescription} */}
              {normalText && <p>{normalText}</p>}

              {bulletPoints.length > 0 && (
                <ul className="list-disc list-inside mt-2">
                  {bulletPoints.map((point, idx) => 
                  <li key = {idx}>{point}</li>)}
                </ul>
              )}
              </div>

            <div className="mt-6 flex justify-center">
              <button 
                className="bg-blue-300 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-400"
                onClick = {()=>alert("You have clicked the invest button!")}>
                  Invest
              </button>
            </div>
          </div>

          {/*Image placeholder*/}
          <div className="flex justify-center"> 
            {company.companyImageUrl ? (
               <img src = {company.companyImageUrl} className="w-full h-auto rounded-lg shadow-md object-cover"/>
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                Picture Placeholder
              </div>
            )}
          </div>
        </div>
      </section>
            
      <section className="py-8 px-4">
        <h2 className="text-3xl text-gray-600 font-bold mb-4 text-left"> Quick Look at Our Statistics</h2>
        <div>
          <FilterBusinessPage companyA={{ companyId: company.id, companyName: company.name }}></FilterBusinessPage>
        </div>
      </section>
      
    </main>
  );
};

export default BusinessPage;