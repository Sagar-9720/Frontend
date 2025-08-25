import React from "react";
import { Table } from "../../../components/common/Table";
import { Button } from "../../../components/common/Button";
import { Edit, Trash2, Calendar } from "lucide-react";
import { Itinerary } from "../../../models/entity/Itinerary";

interface ItineraryTableProps {
  itineraries: Itinerary[];
  loading: boolean;
  onEdit: (itinerary: Itinerary) => void;
  onDelete: (id: number) => void;
}

export const ItineraryTable: React.FC<ItineraryTableProps> = ({ itineraries, loading, onEdit, onDelete }) => {
  try {
    const columns = [
      {
        key: "itineraryName",
        label: "Itinerary",
        sortable: true,
        render: (value: string, itinerary: Itinerary) => {
          try {
            return (
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                <div className="font-medium text-gray-900">{value || 'Untitled'}</div>
              </div>
            );
          } catch (error) {
            console.error('Error rendering itinerary name:', error);
            return <div className="text-red-500">Error loading itinerary</div>;
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
        key: "dayNumber",
        label: "Day",
        render: (dayNumber: number) => {
          try {
            return dayNumber || 'N/A';
          } catch (error) {
            console.error('Error rendering day number:', error);
            return 'Error';
          }
        },
      },
      {
        key: "arrivalTime",
        label: "Arrival",
        render: (arrivalTime: string) => {
          try {
            return arrivalTime || 'N/A';
          } catch (error) {
            console.error('Error rendering arrival time:', error);
            return 'Error';
          }
        },
      },
      {
        key: "departureTime",
        label: "Departure",
        render: (departureTime: string) => {
          try {
            return departureTime || 'N/A';
          } catch (error) {
            console.error('Error rendering departure time:', error);
            return 'Error';
          }
        },
      },
      {
        key: "destinationId",
        label: "Destination",
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
        key: "actions",
        label: "Actions",
        render: (_: any, itinerary: Itinerary) => {
          try {
            return (
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    try {
                      onEdit(itinerary);
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
                      if (itinerary?.id !== undefined) {
                        onDelete(itinerary.id);
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

    return <Table columns={columns} data={itineraries || []} loading={loading} />;
  } catch (error) {
    console.error('Error in ItineraryTable component:', error);
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-red-500">Error loading table</div>
      </div>
    );
  }
};
