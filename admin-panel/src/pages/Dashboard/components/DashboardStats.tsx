import React from "react";

interface StatCard {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  color?: string;
}

interface DashboardStatsProps {
  stats: StatCard[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats = [] }) => {
  try {
    if (!Array.isArray(stats) || stats.length === 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center text-gray-500">
            No statistics available
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {stats.map((stat, idx) => {
          try {
            return (
              <div key={idx} className={`bg-white p-6 rounded-lg shadow-sm border flex items-center`}>
                {stat?.icon && <div className={`mr-4 text-${stat?.color || 'blue'}-600`}>{stat.icon}</div>}
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat?.label || 'Unknown'}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat?.value || 0}</p>
                </div>
              </div>
            );
          } catch (error) {
            console.error(`Error rendering stat at index ${idx}:`, error);
            return (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border text-center text-red-500">
                Error loading stat
              </div>
            );
          }
        })}
      </div>
    );
  } catch (error) {
    console.error('Error in DashboardStats:', error);
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center text-red-500">
          Error loading statistics
        </div>
      </div>
    );
  }
};

export default DashboardStats;
