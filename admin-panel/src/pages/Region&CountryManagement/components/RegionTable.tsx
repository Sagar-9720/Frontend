import React from "react";
import { Table } from "../../../components/common/Table";
import { Button } from "../../../components/common/Button";
import { Edit, MapPin, Globe } from "lucide-react";
import { Region } from "../../../models/entity/Region";
import { Country } from "../../../models/entity/Country";

interface RegionTableProps {
  regions: Region[];
  loading: boolean;
  onEdit: (region: Region) => void;
}

export const RegionTable: React.FC<RegionTableProps> = ({
  regions = [],
  loading = false,
  onEdit,
}) => {
  try {
    // Safe region name renderer
    const renderRegionName = (value: string) => {
      try {
        return (
          <div className="flex items-center">
            <MapPin className="w-5 h-5 text-blue-600 mr-3" />
            <div className="font-medium text-gray-900">{value || "Unknown Region"}</div>
          </div>
        );
      } catch (error) {
        console.error('Error rendering region name:', error);
        return <div className="text-red-500 text-sm">Error loading region</div>;
      }
    };

    // Safe country renderer
    const renderCountry = (country: Country) => {
      try {
        return (
          <div className="flex items-center">
            <Globe className="w-4 h-4 text-green-600 mr-2" />
            <span>{country?.name || "N/A"}</span>
          </div>
        );
      } catch (error) {
        console.error('Error rendering country:', error);
        return <span className="text-red-500">Error</span>;
      }
    };

    // Safe actions renderer
    const renderActions = (_: any, region: Region) => {
      try {
        const handleEdit = () => {
          try {
            if (onEdit && region) {
              onEdit(region);
            }
          } catch (error) {
            console.error('Error calling onEdit:', error);
            alert('Error opening edit form');
          }
        };

        return (
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={handleEdit}>
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        );
      } catch (error) {
        console.error('Error rendering actions:', error);
        return <div className="text-red-500 text-sm">Error</div>;
      }
    };

    const columns = [
      {
        key: "name",
        label: "Region",
        sortable: true,
        render: renderRegionName,
      },
      {
        key: "country",
        label: "Country",
        sortable: true,
        render: renderCountry,
      },
      {
        key: "actions",
        label: "Actions",
        render: renderActions,
      },
    ];

    // Validate regions data
    if (!Array.isArray(regions)) {
      return (
        <div className="text-center py-8 text-red-500">
          <h3 className="text-lg font-medium mb-2">Data Error</h3>
          <p>Invalid regions data format</p>
        </div>
      );
    }

    return <Table columns={columns} data={regions} loading={loading} />;
  } catch (error) {
    console.error('Error in RegionTable:', error);
    return (
      <div className="text-center py-8 text-red-500">
        <h3 className="text-lg font-medium mb-2">Table Error</h3>
        <p>Unable to load regions table</p>
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
