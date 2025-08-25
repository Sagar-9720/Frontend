import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../components/common/Button";
import SubAdminTable from "./components/SubAdminTable";
import SubAdminFormModal from "./components/SubAdminFormModal";
import { useSubAdmins } from "../../DataManagers/subAdminDataManager";
import { User } from "../../models/entity/User";
import { GenericLayout } from "../../components/layout/Layout";

const SubAdminManagement: React.FC = () => {
  try {
    // Safe hook usage with error handling
    const subAdminData = useSubAdmins();
    const {
      subAdmins = [],
      loading = false,
      fetchSubAdmins,
      createSubAdmin,
      updateSubAdmin,
      deleteSubAdmin,
    } = subAdminData || {};

    const [isSubAdminModalOpen, setIsSubAdminModalOpen] = useState(false);
    const [editingSubAdmin, setEditingSubAdmin] = useState<User | null>(null);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [fetchAttempts, setFetchAttempts] = useState(0);
    const MAX_FETCH_ATTEMPTS = 1;

    // Safe useEffect with error handling and fetch attempt limiting
    useEffect(() => {
      const fetchData = async () => {
        try {
          if (
            (!subAdmins || subAdmins.length === 0) &&
            !loading &&
            fetchError &&
            fetchAttempts < MAX_FETCH_ATTEMPTS &&
            fetchSubAdmins
          ) {
            setFetchAttempts((prev) => prev + 1);
            await fetchSubAdmins();
          }
        } catch (error) {
          console.error('Error fetching sub-admins:', error);
          setFetchError('Failed to fetch sub-admins');
        }
      };
      
      fetchData();
    }, [subAdmins, loading, fetchError, fetchAttempts, fetchSubAdmins]);

  // Safe handlers with error handling
  const handleAddSubAdmin = () => {
    try {
      setEditingSubAdmin(null);
      setIsSubAdminModalOpen(true);
    } catch (error) {
      console.error('Error opening add sub-admin modal:', error);
    }
  };

  const handleEditSubAdmin = (subAdmin: User) => {
    try {
      setEditingSubAdmin(subAdmin);
      setIsSubAdminModalOpen(true);
    } catch (error) {
      console.error('Error opening edit sub-admin modal:', error);
    }
  };

  const handleDeleteSubAdmin = async (id: string) => {
    try {
      if (!id) {
        console.error('No ID provided for deletion');
        return;
      }

      if (confirm("Are you sure you want to delete this sub-admin?")) {
        await deleteSubAdmin?.(id);
        await fetchSubAdmins?.();
      }
    } catch (error) {
      console.error('Error deleting sub-admin:', error);
      setFetchError('Failed to delete sub-admin');
    }
  };

  const handleSubmitSubAdmin = async (form: { name: string; email: string }) => {
    try {
      if (editingSubAdmin) {
        await updateSubAdmin?.(editingSubAdmin.userId?.toString() || "");
      } else {
        await createSubAdmin?.({
          ...form,
          status: "active",
          phone: "",
          dob: "",
          gender: "other",
        });
      }
      setIsSubAdminModalOpen(false);
      await fetchSubAdmins?.();
    } catch (error) {
      console.error('Error saving sub-admin:', error);
      setFetchError('Failed to save sub-admin');
    }
  };

  // Safe table and modal components with error handling
  const subAdminTable = (
    <SubAdminTable
      subAdmins={Array.isArray(subAdmins) ? subAdmins : []}
      loading={loading}
      onEdit={handleEditSubAdmin}
      onDelete={(id) => {
        try {
          handleDeleteSubAdmin(String(id));
        } catch (error) {
          console.error('Error in delete handler:', error);
        }
      }}
    />
  );

  const subAdminModal = (
    <SubAdminFormModal
      isOpen={isSubAdminModalOpen}
      onClose={() => {
        try {
          setIsSubAdminModalOpen(false);
        } catch (error) {
          console.error('Error closing modal:', error);
        }
      }}
      onSubmit={handleSubmitSubAdmin}
      initialData={editingSubAdmin}
    />
  );

  // Error section with safe error handling
  const errorSection = fetchError && (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
      <span className="text-red-700 font-medium">{fetchError}</span>
      <Button 
        variant="outline" 
        className="ml-4" 
        onClick={async () => {
          try {
            setFetchError(null);
            setFetchAttempts(0);
            await fetchSubAdmins?.();
          } catch (error) {
            console.error('Error in retry button:', error);
          }
        }}
      >
        Retry
      </Button>
    </div>
  );

  // Filters & Buttons
  const filters = null; // Add filters if needed
  const buttons = (
    <Button onClick={handleAddSubAdmin}>
      <Plus className="w-4 h-4 mr-2" /> Add Sub-Admin
    </Button>
  );

  // Table & Modal
  const table = <>{subAdminTable}</>;
  const modal = subAdminModal;

  // Header
  const title = "Sub-Admin Management";
  const subtitle = "Manage sub-admins";

  return (
    <GenericLayout
      title={title}
      subtitle={subtitle}
      filters={filters}
      buttons={buttons}
      errorSection={errorSection}
      table={table}
      modal={modal}
    />
  );
  } catch (error) {
    console.error('Error in SubAdminManagement component:', error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-500 text-lg mb-4">
          Something went wrong while loading sub-admin management
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

export default SubAdminManagement;
