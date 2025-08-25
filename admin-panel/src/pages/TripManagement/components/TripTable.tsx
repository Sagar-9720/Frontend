import React from "react";
import { Table } from "../../../components/common/Table";
import { Button } from "../../../components/common/Button";
import { Edit, Trash2, MapPin } from "lucide-react";
import { Trip } from "../../../models/entity/Trip";

interface TripTableProps {
  trips: Trip[];
  loading: boolean;
  onEdit: (trip: Trip) => void;
  onDelete: (id: number) => void;
}

export const TripTable: React.FC<TripTableProps> = ({ trips, loading, onEdit, onDelete }) => {
  try {
    const columns = [
      {
        key: "title",
        label: "Trip",
        sortable: true,
        render: (value: string, trip: Trip) => {
          try {
            return (
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-blue-600 mr-3" />
                <div className="font-medium text-gray-900">{value || 'Untitled'}</div>
              </div>
            );
          } catch (error) {
            console.error('Error rendering trip title:', error);
            return <div className="text-red-500">Error loading trip</div>;
          }
        },
      },
      {
        key: "description",
        label: "Description",
        sortable: true,
        render: (description: string) => {
          try {
            return description || 'No description';
          } catch (error) {
            console.error('Error rendering description:', error);
            return 'Error';
          }
        },
      },
      {
        key: "startDate",
        label: "Start Date",
        render: (date: string) => {
          try {
            if (!date) return 'N/A';
            return new Date(date).toLocaleDateString();
          } catch (error) {
            console.error('Error formatting start date:', error);
            return 'Invalid date';
          }
        },
      },
      {
        key: "endDate",
        label: "End Date",
        render: (date: string) => {
          try {
            if (!date) return 'N/A';
            return new Date(date).toLocaleDateString();
          } catch (error) {
            console.error('Error formatting end date:', error);
            return 'Invalid date';
          }
        },
      },
      {
        key: "price",
        label: "Price",
        render: (price: number) => {
          try {
            return `₹${price || 0}`;
          } catch (error) {
            console.error('Error formatting price:', error);
            return '₹0';
          }
        },
      },
      {
        key: "mainDestinationId",
        label: "Main Destination",
        render: (destinationId: any) => {
          try {
            return destinationId || 'N/A';
          } catch (error) {
            console.error('Error rendering destination:', error);
            return 'Error';
          }
        },
      },
      {
        key: "createdBy",
        label: "Created By",
        render: (createdBy: string) => {
          try {
            return createdBy || 'Unknown';
          } catch (error) {
            console.error('Error rendering created by:', error);
            return 'Error';
          }
        },
      },
      {
        key: "actions",
        label: "Actions",
        render: (_: any, trip: Trip) => {
          try {
            return (
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    try {
                      onEdit(trip);
                    } catch (error) {
                      console.error('Error in edit handler:', error);
                    }
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="danger" 
                  onClick={() => {
                    try {
                      if (trip?.id !== undefined) {
                        onDelete(trip.id);
                      }
                    } catch (error) {
                      console.error('Error in delete handler:', error);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            );
          } catch (error) {
            console.error('Error rendering actions:', error);
            return <div className="text-red-500">Error</div>;
          }
        },
      },
    ];

    return <Table columns={columns} data={trips || []} loading={loading} />;
  } catch (error) {
    console.error('Error in TripTable component:', error);
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-red-500">Error loading table</div>
      </div>
    );
  }
};
