import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../components/common/Button";
import UserTable from "./components/UserTable";
import { useUserData } from "../../DataManagers/userDataManager";
import { User } from "../../models/entity/User";
import { GenericLayout } from "../../components/layout/Layout";
import { ExportCSVButton } from "../../components/common/ExportCSVButton";

// Helper for CSV export with error handling
const getCSVData = (users: User[]) => {
  try {
    if (!Array.isArray(users)) {
      console.warn('Invalid users data for CSV export:', users);
      return [];
    }
    
    return users.map((u) => {
      try {
        return {
          Name: u?.name || 'N/A',
          Email: u?.email || 'N/A',
          Phone: u?.phone || 'N/A',
          Role: u?.roles || 'N/A',
          Gender: u?.gender || 'N/A',
          "Date of Birth": u?.dob || 'N/A',
        };
      } catch (error) {
        console.error('Error processing user for CSV:', error, u);
        return {
          Name: 'Error',
          Email: 'Error',
          Phone: 'Error',
          Role: 'Error',
          Gender: 'Error',
          "Date of Birth": 'Error',
        };
      }
    });
  } catch (error) {
    console.error('Error generating CSV data:', error);
    return [];
  }
};

const UserManagement: React.FC = () => {
  try {
    // Safe hook usage with error handling
    const userDataManager = useUserData();
    const {
      getAllUsers,
      deleteUser,
      getRequestedDeleteUser,
    } = userDataManager || {};

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [genderFilter, setGenderFilter] = useState<string>("");
  const [showDeleteRequests, setShowDeleteRequests] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: "",
    to: "",
  });
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [deleteRequestUsers, setDeleteRequestUsers] = useState<User[]>([]);
  const [fetchAttempts, setFetchAttempts] = useState(0);
  const MAX_FETCH_ATTEMPTS = 1;

  // Safe fetch users with error handling and fetch attempt limiting
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Only auto-retry if there's an error and we haven't exceeded max attempts
        const shouldFetch = !fetchError || 
          (fetchError && fetchAttempts < MAX_FETCH_ATTEMPTS);
        
        if (shouldFetch && (getAllUsers || getRequestedDeleteUser)) {
          if (fetchError) {
            setFetchAttempts((prev) => prev + 1);
          }
          
          setLoading(true);
          setFetchError(null);
          
          if (showDeleteRequests) {
            const response = await getRequestedDeleteUser?.();
            if (response?.success) {
              setDeleteRequestUsers(Array.isArray(response.data) ? response.data : []);
            } else {
              throw new Error('Failed to fetch delete requests');
            }
          } else {
            const response = await getAllUsers?.();
            if (response?.success) {
              setUsers(Array.isArray(response.data) ? response.data : []);
            } else {
              throw new Error('Failed to fetch users');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setFetchError(error instanceof Error ? error.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showDeleteRequests, getAllUsers, getRequestedDeleteUser, fetchError, fetchAttempts]);

  // Safe filter users with comprehensive error handling
  const filteredUsers = (() => {
    try {
      const sourceUsers = showDeleteRequests ? deleteRequestUsers : users;
      
      if (!Array.isArray(sourceUsers)) {
        console.warn('Source users is not an array:', sourceUsers);
        return [];
      }

      return sourceUsers.filter((user: User) => {
        try {
          // Safe search filtering
          const searchLower = searchTerm.toLowerCase();
          const matchesSearch = !searchTerm || (
            (user?.name || '').toLowerCase().includes(searchLower) ||
            (user?.email || '').toLowerCase().includes(searchLower) ||
            (user?.phone || '').toLowerCase().includes(searchLower) ||
            (user?.dob || '').includes(searchTerm)
          );

          // Safe role filtering
          const matchesRole = !roleFilter || (user?.roles === roleFilter);

          // Safe gender filtering
          const matchesGender = !genderFilter || (user?.gender === genderFilter);

          // Safe date range filtering
          const matchesDate = (!dateRange.from || !dateRange.to) || (
            user?.dob && 
            user.dob >= dateRange.from && 
            user.dob <= dateRange.to
          );

          return matchesSearch && matchesRole && matchesGender && matchesDate;
        } catch (error) {
          console.error('Error filtering user:', error, user);
          return false;
        }
      });
    } catch (error) {
      console.error('Error in filteredUsers:', error);
      return [];
    }
  })();

  // Safe refresh handler
  const handleRefresh = async () => {
    try {
      setFetchError(null);
      setFetchAttempts(0);
      const fetchData = async () => {
        try {
          setLoading(true);
          if (showDeleteRequests) {
            const response = await getRequestedDeleteUser?.();
            if (response?.success) {
              setDeleteRequestUsers(Array.isArray(response.data) ? response.data : []);
            }
          } else {
            const response = await getAllUsers?.();
            if (response?.success) {
              setUsers(Array.isArray(response.data) ? response.data : []);
            }
          }
        } catch (error) {
          console.error('Error refreshing users:', error);
          setFetchError('Failed to refresh data');
        } finally {
          setLoading(false);
        }
      };
      await fetchData();
    } catch (error) {
      console.error('Error in refresh handler:', error);
    }
  };

  // Safe delete handler
  const handleDelete = async (userId: string) => {
    try {
      if (!userId) {
        console.error('No user ID provided for deletion');
        return;
      }
      
      const response = await deleteUser?.(userId);
      if (response?.success) {
        // Refresh the user list after successful deletion
        await handleRefresh();
      } else {
        console.error('Failed to delete user:', response);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Safe approve delete handler (placeholder)
  const handleApproveDelete = async (userId: string) => {
    try {
      if (!userId) {
        console.error('No user ID provided for approve delete');
        return;
      }
      // TODO: Implement approve delete logic
      console.log('Approve delete for user:', userId);
    } catch (error) {
      console.error('Error approving delete:', error);
    }
  };

  // Error section with safe error handling
  const errorSection = fetchError && (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
      <span className="text-red-700 font-medium">{fetchError}</span>
      <Button
        variant="outline"
        className="ml-4"
        onClick={() => {
          try {
            handleRefresh();
          } catch (error) {
            console.error('Error in retry button:', error);
          }
        }}
      >
        Retry
      </Button>
    </div>
  );

  // Safe filters with error handling
  const filters = (
    <div className="flex flex-wrap gap-2 items-center">
      <input
        type="text"
        placeholder="Search by name, email, phone, DOB..."
        className="border rounded px-2 py-1 w-48"
        value={searchTerm}
        onChange={(e) => {
          try {
            setSearchTerm(e.target.value);
          } catch (error) {
            console.error('Error updating search term:', error);
          }
        }}
      />
      <select
        className="border rounded px-2 py-1"
        value={roleFilter}
        onChange={(e) => {
          try {
            setRoleFilter(e.target.value);
          } catch (error) {
            console.error('Error updating role filter:', error);
          }
        }}
      >
        <option value="">All Roles</option>
        <option value="Admin">Admin</option>
        <option value="User">User</option>
        <option value="SubAdmin">Sub-Admin</option>
      </select>
      <select
        className="border rounded px-2 py-1"
        value={genderFilter}
        onChange={(e) => {
          try {
            setGenderFilter(e.target.value);
          } catch (error) {
            console.error('Error updating gender filter:', error);
          }
        }}
      >
        <option value="">All Genders</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      <label className="flex items-center gap-1">
        <input
          type="checkbox"
          checked={showDeleteRequests}
          onChange={() => {
            try {
              setShowDeleteRequests((v) => !v);
            } catch (error) {
              console.error('Error toggling delete requests:', error);
            }
          }}
        />
        Show Delete Requests
      </label>
      <div className="flex items-center gap-1">
        <span>DOB:</span>
        <input
          type="date"
          value={dateRange.from}
          onChange={(e) => {
            try {
              setDateRange((r) => ({ ...r, from: e.target.value }));
            } catch (error) {
              console.error('Error updating date range from:', error);
            }
          }}
          className="border rounded px-2 py-1"
        />
        <span>-</span>
        <input
          type="date"
          value={dateRange.to}
          onChange={(e) => {
            try {
              setDateRange((r) => ({ ...r, to: e.target.value }));
            } catch (error) {
              console.error('Error updating date range to:', error);
            }
          }}
          className="border rounded px-2 py-1"
        />
      </div>
    </div>
  );

  // Safe buttons with error handling
  const buttons = (
    <div className="flex gap-2">
      <Button 
        onClick={() => {
          try {
            console.log("Open add user modal");
          } catch (error) {
            console.error('Error opening add user modal:', error);
          }
        }}
      >
        <Plus className="w-4 h-4 mr-2" /> Add User
      </Button>
      <ExportCSVButton 
        data={getCSVData(filteredUsers)} 
        filename="users.csv" 
      />
    </div>
  );

  // Safe table with error handling
  const table = (
    <UserTable
      users={filteredUsers}
      loading={loading}
      onDelete={handleDelete}
      onApproveDelete={handleApproveDelete}
    />
  );

  // Header
  const title = "User Management";
  const subtitle = "Manage users";

  return (
    <GenericLayout
      title={title}
      subtitle={subtitle}
      filters={filters}
      buttons={buttons}
      errorSection={errorSection}
      table={table}
    />
  );
  } catch (error) {
    console.error('Error in UserManagement component:', error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-500 text-lg mb-4">
          Something went wrong while loading user management
        </div>
        <Button
          onClick={() => window.location.reload()}
          variant="primary"
        >
          Reload Page
        </Button>
      </div>
    );
  }
};

export default UserManagement;
