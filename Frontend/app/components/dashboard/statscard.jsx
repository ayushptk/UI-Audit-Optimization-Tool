import React from 'react';
import { FaPenNib } from "react-icons/fa6";
import { TbReportSearch } from "react-icons/tb";
import { FaStar } from 'react-icons/fa';
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';

const StatsCard = () => {
  const stats = [
    {
      title: "Total Designs",
      value: "150",
      change: "+12.5%",
      trend: "up",
      icon: FaPenNib,
      color: "blue",
      description: "vs. last month"
    },
    {
      title: "Audit Reports",
      value: "45",
      change: "+8.2%",
      trend: "up",
      icon: TbReportSearch,
      color: "indigo",
      description: "vs. last month"
    },
    {
      title: "Avg. Score",
      value: "85%",
      change: "-2.4%",
      trend: "down",
      icon: FaStar,
      color: "amber",
      description: "vs. last month"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
      indigo: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
      amber: "bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl transition-colors duration-300 ${getColorClasses(stat.color)}`}>
                <Icon className="text-xl" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${stat.trend === 'up'
                  ? 'bg-green-50 text-green-600'
                  : 'bg-red-50 text-red-600'
                }`}>
                {stat.trend === 'up' ? <FiArrowUpRight /> : <FiArrowDownRight />}
                {stat.change}
              </div>
            </div>

            <div>
              <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.title}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900 font-outfit">{stat.value}</span>
                <span className="text-xs text-slate-400">{stat.description}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCard;
