import React from 'react';
import { FiFilter } from 'react-icons/fi';

type SideBarFilterButtonProps = {
  onClick: () => void;
};

const SideBarFilterButton: React.FC<SideBarFilterButtonProps> = ({ onClick }) => {
  return (
    <div>
      <button
        onClick={onClick}
        className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-200"
      >
        <FiFilter className="font-bold" />
        Selection
      </button>
    </div>
  );
};

export default SideBarFilterButton;
