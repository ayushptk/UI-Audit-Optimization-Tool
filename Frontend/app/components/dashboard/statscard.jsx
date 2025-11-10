import React from 'react';
import { FaFileUpload, FaFileAlt, FaStar } from 'react-icons/fa';
import { FaPenNib } from "react-icons/fa6";
import { TbReportSearch } from "react-icons/tb";
const StatsCard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {/* Total Designs Uploaded */}
    
    {/* design first card */}
    <div className="bg-white dark:bg-gray-800  rounded-lg p-6  space-x-4 border border-gray-200 shadow-xs ">
      <div className=" flex gap-4  mb-4">
        <div className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-full p-3">
         <FaPenNib className="text-orange-500 text-3xl" />
        </div>
        <div>
          <h3 className="text-md font-large text-gray-900 dark:text-white"> Designs</h3>
          <p className="text-xl font-bold text-gray-700 dark:text-gray-300">150</p>
        </div>
      </div>
      <div className="flex items-center space-x-1 text-sm ">
      {/* Up Arrow SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="green"
        className="w-4 h-4"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 12l8-8 8 8M12 4v16" />
      </svg>

      {/* Percentage and Text */}
      <span className="text-green-600 font-medium">1.21%</span>
      <span className="text-gray-800">from last Monday</span>
    </div>
      
      </div>

      {/* Number of Audit Reports Generated */}
      <div className="bg-white dark:bg-gray-800  rounded-lg p-6  space-x-4 border border-gray-200 shadow-xs ">
        <div className=" flex gap-4  mb-4">
          <div className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-full p-3">
           <TbReportSearch  className="text-green-500 text-3xl"/>
          </div>
          <div>
            <h3 className="text-md font-large text-gray-900 dark:text-white">Audit Reports</h3>
            <p className="text-xl font-bold text-gray-700 dark:text-gray-300">45</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-sm ">
        {/* Up Arrow SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="green"
          className="w-4 h-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 12l8-8 8 8M12 4v16" />
        </svg>

        {/* Percentage and Text */}
        <span className="text-green-600 font-medium">2.5%</span>
        <span className="text-gray-800">from last Monday</span>
      </div>
        
        </div>

        {/* Average Design Score */}
        <div className="bg-white dark:bg-gray-800  rounded-lg p-6  space-x-4 border border-gray-200 shadow-xs ">
          <div className=" flex gap-4  mb-4">
            <div className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-full p-3">
             <FaStar className="text-yellow-500 text-3xl" />
            </div>
            <div>
              <h3 className="text-md font-large text-gray-900 dark:text-white">Average Design Score</h3>
              <p className="text-xl font-bold text-gray-700 dark:text-gray-300">85%</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-sm ">
          {/* Up Arrow SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="green"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 12l8-8 8 8M12 4v16" />
          </svg>

          {/* Percentage and Text */}
          <span className="text-green-600 font-medium">3.1%</span>
          <span className="text-gray-800">from last Monday</span>
        </div>
          
          </div>
    </div>
  );
};

export default StatsCard;
