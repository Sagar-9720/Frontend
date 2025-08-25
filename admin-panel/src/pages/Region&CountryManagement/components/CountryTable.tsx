import React from "react";
import { Table } from "../../../components/common/Table";
import { Button } from "../../../components/common/Button";
import { Edit } from "lucide-react";
import { Country } from "../../../models/entity/Country";

interface CountryTableProps {
  countries: Country[];
  loading: boolean;
  onEdit: (country: Country) => void;
}

export const CountryTable: React.FC<CountryTableProps> = ({
  countries = [],
  loading = false,
  onEdit,
}) => {
  try {
    // Safe country name renderer
    const renderCountryName = (value: string) => {
      try {
        return value || "Unknown Country";
      } catch (error) {
        console.error('Error rendering country name:', error);
        return "Error loading name";
      }
    };

    // Safe ID renderer
    const renderCountryId = (value: any) => {
      try {
        return value ? String(value) : "N/A";
      } catch (error) {
        console.error('Error rendering country ID:', error);
        return "Error";
      }
    };

    // Safe actions renderer
    const renderActions = (_: any, country: Country) => {
      try {
        const handleEdit = () => {
          try {
            if (onEdit && country) {
              onEdit(country);
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
        label: "Country Name",
        sortable: true,
        render: renderCountryName,
      },
      {
        key: "id",
        label: "ID",
        sortable: true,
        render: renderCountryId,
      },
      {
        key: "actions",
        label: "Actions",
        render: renderActions,
      },
    ];

    // Validate countries data
    if (!Array.isArray(countries)) {
      return (
        <div className="text-center py-8 text-red-500">
          <h3 className="text-lg font-medium mb-2">Data Error</h3>
          <p>Invalid countries data format</p>
        </div>
      );
    }

    return <Table columns={columns} data={countries} loading={loading} />;
  } catch (error) {
    console.error('Error in CountryTable:', error);
    return (
      <div className="text-center py-8 text-red-500">
        <h3 className="text-lg font-medium mb-2">Table Error</h3>
        <p>Unable to load countries table</p>
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
