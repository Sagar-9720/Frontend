import React from "react";

interface DashboardChartsProps {
  children?: React.ReactNode;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ children }) => {
  try {
    return (
      <div className="mb-6">
        {/* Place chart components here */}
        {children}
      </div>
    );
  } catch (error) {
    console.error('Error in DashboardCharts:', error);
    return (
      <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border text-center text-red-500">
        <h3 className="text-lg font-medium mb-2">Charts Error</h3>
        <p>Unable to load dashboard charts</p>
      </div>
    );
  }
};

export default DashboardCharts;
