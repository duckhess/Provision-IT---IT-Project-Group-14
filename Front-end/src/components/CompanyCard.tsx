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
  projectShortDescription : string;
  estDate : string;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ id, companyName , onClick, isActive }) => {
  const [companyCardDetail, setCompanyCardDetails] = useState <CompanyCardInfo | null> (null);
  const [loading, setLoading] = useState<boolean> (false);

  // useEffect (() => {
  //     const fetchCompanies = async () => {
  //       try {
  //         setLoading(true);
  //         const response = await axios.get<CompanyCardInfo> (
  //           `http://localhost:7000/companies/${id}`
  //         );
  //         setCompanyCardDetails(response.data);

  //       } catch (err){
  //         console.error("error fetching companies data",err);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };
  //     fetchCompanies();
  //   }, [id]);
  // }


  return (
    <div
      className={`p-4 rounded cursor-pointer mb-2 ${
        isActive ? 'bg-blue-100 border-blue-400' : 'bg-white'
      }`}
      onClick={() => onClick(id)}
    >
      <h3 className='font-bold'>{companyName}</h3>
      {/* <p className='text-gray-600 text-sm'>{projectShortDescription}</p>
      <p className='text-gray-400 text-xs'> Est. {estDate}</p> */}
    </div>
  );
};

export default CompanyCard;