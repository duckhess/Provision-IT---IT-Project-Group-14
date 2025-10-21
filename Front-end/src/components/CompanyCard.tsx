import React from 'react';
import { useState, useEffect } from 'react';
import axios from "axios";

interface CompanyCardProps {
  id: number;
  companyName: string;
  onClick: (id: number) => void;
  isActive: boolean;
}

interface CompanyCardInfo {
  projectShortDescription: string;
  estDate: string;
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

const CompanyCard: React.FC<CompanyCardProps> = ({ id, companyName , onClick, isActive }) => {
  const [companyCardDetails, setCompanyCardDetails] = useState<CompanyCardInfo | null>(null);
  const [loading, setLoading] = useState<boolean> (false);

  useEffect (() => {
      const fetchCompanies = async (id : number) => {
        try {
          setLoading(true);
          const response = await axios.get<BackendCompanyData[]> (
            `/api/company_data?CompanyID=${id}`
          );

        //console.log("Backend reponse", response.data);
        
        // response is parsed as an array
        if (response.data.length > 0) {
          const firstCompany = response.data[0];
          setCompanyCardDetails({
            projectShortDescription : firstCompany.ShortApplicationDescription,
            estDate : firstCompany.YearEstablished,
          });
        } else {
          setCompanyCardDetails({
            projectShortDescription: "No description available",
            estDate : 'N/A',
          });
        }

        } catch (err){
          console.error("error fetching companies data",err);
        } finally {
          setLoading(false);
        }
      };
      fetchCompanies(id);
    }, [id]);



  return (
    <div
      className={`relative p-4 rounded cursor-pointer mb-2 ${
        isActive ? 'bg-blue-100 border-blue-400' : 'bg-white'
      }`}
      onClick={() => onClick(id)}
    >
      <h3 className='font-bold'>{companyName}</h3>
      <p className='text-gray-600 text-sm'>{companyCardDetails?.projectShortDescription}</p>
      <p className='text-gray-400 text-xs'> Est. {companyCardDetails?.estDate}</p>

      <img 
      src={`/Pic/${id}_logo.png`} 
      className='absolute bottom-2 right-2 w-8 h-8 rounded-full border border-gray-200 shadow-sm object-contain'></img>
    </div>
  );
};

export default CompanyCard;