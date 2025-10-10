import React from 'react';

interface CompanyCardProps {
  id: string;
  text: string;
  onClick: (id: string) => void;
  isActive: boolean;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ id, text, onClick, isActive }) => {
  return (
    <div
      className={`p-4 border rounded cursor-pointer mb-2 ${
        isActive ? 'bg-blue-100 border-blue-400' : 'bg-white'
      }`}
      onClick={() => onClick(id)}
    >
      {text}
    </div>
  );
};

export default CompanyCard;