import React from "react";
import { Table } from "../../../components/common/Table";
import { Button } from "../../../components/common/Button";
import { Trash2, CheckCircle } from "lucide-react";
import { User } from "../../../models";

interface UserTableProps {
  users: User[];
  loading: boolean;
  onApproveDelete: (id: string) => void;
  onDelete: (id: string) => void;
}

function getUserColumns(
  onApproveDelete: (id: string) => void,
  onDelete: (id: string) => void
) {
  try {
    return [
      {
        key: "name",
        label: "Name",
        sortable: true,
        render: (name: string) => {
          try {
            return name || 'N/A';
          } catch (error) {
            console.error('Error rendering name:', error);
            return 'Error';
          }
        },
      },
      {
        key: "email",
        label: "Email",
        sortable: true,
        render: (email: string) => {
          try {
            return email || 'N/A';
          } catch (error) {
            console.error('Error rendering email:', error);
            return 'Error';
          }
        },
      },
      {
        key: "roles",
        label: "Role",
        sortable: true,
        render: (role: string) => {
          try {
            return role || 'N/A';
          } catch (error) {
            console.error('Error rendering role:', error);
            return 'Error';
          }
        },
      },
      {
        key: "status",
        label: "Status",
        render: (value: string) => {
          try {
            const status = value || 'unknown';
            return (
              <span
                className={`px-2 py-1 rounded text-xs ${
                  status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {status}
              </span>
            );
          } catch (error) {
            console.error('Error rendering status:', error);
            return <span className="text-red-500">Error</span>;
          }
        },
      },
      {
        key: "actions",
        label: "Actions",
        render: (_: any, user: User) => {
          try {
            return (
              <div className="flex space-x-2">
                {(user as any)?.status === "inactive" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      try {
                        if (user?.userId) {
                          onApproveDelete(user.userId.toString());
                        }
                      } catch (error) {
                        console.error('Error approving delete:', error);
                      }
                    }}
                    title="Approve"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    try {
                      if (user?.userId) {
                        onDelete(user.userId.toString());
                      }
                    } catch (error) {
                      console.error('Error deleting user:', error);
                    }
                  }}
                  title="Delete"
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
  } catch (error) {
    console.error('Error creating user columns:', error);
    return [];
  }
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  onApproveDelete,
  onDelete,
}) => {
  try {
    const columns = getUserColumns(onApproveDelete, onDelete);
    const safeUsers = Array.isArray(users) ? users : [];
    
    return (
      <div>
        <div className="flex justify-end mb-2"></div>
        <Table columns={columns} data={safeUsers} loading={loading} />
      </div>
    );
  } catch (error) {
    console.error('Error in UserTable component:', error);
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-red-500">Error loading user table</div>
      </div>
    );
  }
};

export default UserTable;
