import React from "react";
import { Edit, Trash2, User as UserIcon } from "lucide-react";
import { Table } from "../../../components/common/Table";
import { User } from "../../../models";
import { Button } from "../../../components/common/Button";

interface SubAdminTableProps {
  subAdmins: User[];
  loading: boolean;
  onEdit: (subAdmin: User) => void;
  onDelete: (subAdminId: number) => void;
}

const getSubAdminColumns = (
  onEdit: (subAdmin: User) => void,
  onDelete: (subAdminId: number) => void
) => {
  try {
    return [
      {
        key: "name",
        label: "Name",
        sortable: true,
        render: (value: string) => {
          try {
            return (
              <div className="flex items-center">
                <UserIcon className="w-4 h-4 text-green-600 mr-2" />
                <span className="font-medium">{value || 'N/A'}</span>
              </div>
            );
          } catch (error) {
            console.error('Error rendering sub-admin name:', error);
            return <span className="text-red-500">Error</span>;
          }
        },
      },
      {
        key: "email",
        label: "Email",
        sortable: true,
        render: (value: string) => {
          try {
            return <span>{value || 'N/A'}</span>;
          } catch (error) {
            console.error('Error rendering email:', error);
            return <span className="text-red-500">Error</span>;
          }
        },
      },
      {
        key: "roles",
        label: "Role",
        sortable: true,
        render: (value: string) => {
          try {
            return <span>{value || 'N/A'}</span>;
          } catch (error) {
            console.error('Error rendering role:', error);
            return <span className="text-red-500">Error</span>;
          }
        },
      },
      {
        key: "createdAt",
        label: "Created",
        sortable: true,
        render: (value: string | undefined) => {
          try {
            return (
              <span className="text-gray-600 text-sm">
                {value ? new Date(value).toLocaleDateString() : "Unknown"}
              </span>
            );
          } catch (error) {
            console.error('Error rendering created date:', error);
            return <span className="text-red-500">Error</span>;
          }
        },
      },
      {
        key: "actions",
        label: "Actions",
        render: (_: any, subAdmin: User) => {
          try {
            return (
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    try {
                      onEdit(subAdmin);
                    } catch (error) {
                      console.error('Error in edit handler:', error);
                    }
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                {subAdmin?.userId && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      try {
                        onDelete(subAdmin.userId!);
                      } catch (error) {
                        console.error('Error in delete handler:', error);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            );
          } catch (error) {
            console.error('Error rendering actions:', error);
            return <div className="text-red-500">Error</div>;
          }
        },
      },
    ];
  } catch (error) {
    console.error('Error creating sub-admin columns:', error);
    return [];
  }
};

const SubAdminTable: React.FC<SubAdminTableProps> = ({
  subAdmins,
  loading,
  onEdit,
  onDelete,
}) => {
  try {
    const columns = getSubAdminColumns(onEdit, onDelete);
    const safeSubAdmins = Array.isArray(subAdmins) ? subAdmins : [];
    
    return (
      <div>
        <Table columns={columns} data={safeSubAdmins} loading={loading} />
      </div>
    );
  } catch (error) {
    console.error('Error in SubAdminTable component:', error);
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-red-500">Error loading sub-admin table</div>
      </div>
    );
  }
};

export default SubAdminTable;
