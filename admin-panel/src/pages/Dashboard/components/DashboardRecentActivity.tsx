import React from "react";

interface ActivityItem {
  id: string | number;
  description: string;
  timestamp: string;
}

interface DashboardRecentActivityProps {
  activities: ActivityItem[];
}

const DashboardRecentActivity: React.FC<DashboardRecentActivityProps> = ({ activities = [] }) => {
  try {
    if (!Array.isArray(activities) || activities.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="text-center text-gray-500 py-4">
            No recent activity available
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <ul className="divide-y divide-gray-200">
          {activities.map((item, index) => {
            try {
              return (
                <li key={item?.id || index} className="py-3 flex justify-between items-center">
                  <span className="text-gray-700">{item?.description || 'Unknown activity'}</span>
                  <span className="text-xs text-gray-500">
                    {item?.timestamp ? new Date(item.timestamp).toLocaleString() : 'Unknown time'}
                  </span>
                </li>
              );
            } catch (error) {
              console.error(`Error rendering activity at index ${index}:`, error);
              return (
                <li key={item?.id || index} className="py-3 text-red-500 text-sm">
                  Error loading activity
                </li>
              );
            }
          })}
        </ul>
      </div>
    );
  } catch (error) {
    console.error('Error in DashboardRecentActivity:', error);
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="text-center text-red-500 py-4">
          Error loading recent activities
        </div>
      </div>
    );
  }
};

export default DashboardRecentActivity;
