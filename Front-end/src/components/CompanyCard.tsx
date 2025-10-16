import React from 'react';

interface CompanyCardProps {
  id: number;
  companyName: string;
  // projectShortDescription : string;
  // estDate : string;
  onClick: (id: number) => void;
  isActive: boolean;

  //projectShortDescription, estDate
}

const CompanyCard: React.FC<CompanyCardProps> = ({ id, companyName , onClick, isActive }) => {
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