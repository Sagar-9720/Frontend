import React from "react";
import { Table } from "../../../components/common/Table";
import { Destination } from "../../../models/entity/Destination";
import { Button } from "../../../components/common/Button";
import { Edit, MapPin } from "lucide-react";

interface DestinationTableProps {
  destinations: Destination[];
  loading: boolean;
  onEdit: (destination: Destination) => void;
}

export const DestinationTable: React.FC<DestinationTableProps> = ({
  destinations = [],
  loading = false,
  onEdit,
}) => {
  try {
    // Safe destination name renderer with image
    const renderDestinationName = (value: string, destination: Destination) => {
      try {
        const imageSrc = destination?.imageUrl || '/placeholder-image.jpg';
        const destinationName = value || 'Unknown Destination';
        const regionName = destination?.region?.name || "No region";

        return (
          <div className="flex items-center">
            <img
              src={imageSrc}
              alt={destinationName}
              className="w-12 h-12 rounded-lg object-cover mr-3"
              onError={(e) => {
                try {
                  (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                } catch (err) {
                  console.error('Error setting fallback image:', err);
                }
              }}
            />
            <div>
              <div className="font-medium text-gray-900">{destinationName}</div>
              <div className="text-sm text-gray-500 flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {regionName}
              </div>
            </div>
          </div>
        );
      } catch (error) {
        console.error('Error rendering destination name:', error);
        return (
          <div className="text-red-500 text-sm">
            Error loading destination
          </div>
        );
      }
    };

    // Safe description renderer
    const renderDescription = (value: string) => {
      try {
        return value || "No description";
      } catch (error) {
        console.error('Error rendering description:', error);
        return "Error loading description";
      }
    };

    // Safe region renderer
    const renderRegion = (_: any, destination: Destination) => {
      try {
        const regionName = destination?.region?.name || 'Unknown';
        const countryName = destination?.region?.country?.name || "N/A";
        const displayText = destination?.region 
          ? `${regionName}, ${countryName}`
          : "N/A";

        return (
          <span className="text-gray-600">
            {displayText}
          </span>
        );
      } catch (error) {
        console.error('Error rendering region:', error);
        return <span className="text-red-500">Error</span>;
      }
    };

    // Safe actions renderer
    const renderActions = (_: any, destination: Destination) => {
      try {
        const handleEdit = () => {
          try {
            if (onEdit && destination) {
              onEdit(destination);
            }
          } catch (error) {
            console.error('Error calling onEdit:', error);
            alert('Error opening edit form');
          }
        };

        return (
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleEdit}
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        );
      } catch (error) {
        console.error('Error rendering actions:', error);
        return <div className="text-red-500 text-sm">Error</div>;
      }
    };

    // Column definitions with error handling
    const columns = [
      {
        key: "name",
        label: "Destination",
        sortable: true,
        render: renderDestinationName,
      },
      { 
        key: "description", 
        label: "Description", 
        sortable: true,
        render: renderDescription,
      },
      {
        key: "region",
        label: "Region",
        sortable: true,
        render: renderRegion,
      },
      {
        key: "actions",
        label: "Actions",
        render: renderActions,
      },
    ];

    // Validate destinations data
    if (!Array.isArray(destinations)) {
      return (
        <div className="text-center py-8 text-red-500">
          <h3 className="text-lg font-medium mb-2">Data Error</h3>
          <p>Invalid destinations data format</p>
        </div>
      );
    }

    return (
      <Table 
        columns={columns} 
        data={destinations} 
        loading={loading} 
      />
    );
  } catch (error) {
    console.error('Error in DestinationTable:', error);
    return (
      <div className="text-center py-8 text-red-500">
        <h3 className="text-lg font-medium mb-2">Table Error</h3>
        <p>Unable to load destinations table</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => window.location.reload()}
          className="mt-2"
        >
          Reload Page
        </Button>
      </div>
    );
  }
};
