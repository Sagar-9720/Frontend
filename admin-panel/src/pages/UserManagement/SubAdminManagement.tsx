import React, {useState} from "react";
import SubAdminTable from "./components/SubAdminTable";
import SubAdminFormModal from "./components/SubAdminFormModal";
import {useSubAdmins} from "../../DataManagers/subAdminDataManager";
import {User} from "../../models/entity/User";
import {GenericLayout} from "../../components/layout/Layout";
import {logger} from "../../utils";
import {ErrorBanner} from "../../components/common/ErrorBanner";
import {PAGE_TITLES, PAGE_SUBTITLES} from "../../utils";
import { SubAdminActions } from "./sections/SubAdminActions.tsx";

const log = logger.forSource('SubAdminManagementPage');

const SubAdminManagement: React.FC = () => {
    const subAdminData = useSubAdmins();
    const {
        subAdmins = [],
        loading = false,
        error: hookError,
        fetchSubAdmins,
        createSubAdmin,
        updateSubAdmin,
        deleteSubAdmin,
    } = subAdminData || {};

    const [isSubAdminModalOpen, setIsSubAdminModalOpen] = useState(false);
    const [editingSubAdmin, setEditingSubAdmin] = useState<User | null>(null);
    // Local error (CRUD) merged with hook error for display
    const [localError, setLocalError] = useState<string | null>(null);

    const loadError = localError || (hookError ? 'Failed to load sub-admins' : null);

    // Handlers
    const handleAddSubAdmin = () => {
        try {
            setEditingSubAdmin(null);
            setIsSubAdminModalOpen(true);
        } catch (error) {
            log.error('Error opening add sub-admin modal', error as unknown);
        }
    };

    const handleEditSubAdmin = (subAdmin: User) => {
        try {
            setEditingSubAdmin(subAdmin);
            setIsSubAdminModalOpen(true);
        } catch (error) {
            log.error('Error opening edit sub-admin modal', error as unknown);
        }
    };

    const handleDeleteSubAdmin = async (id: string) => {
        try {
            if (!id) return;
            if (confirm("Are you sure you want to delete this sub-admin?")) {
                const res = await deleteSubAdmin?.(id);
                if (res && typeof res === 'object' && 'error' in res) setLocalError('Failed to delete sub-admin');
                await fetchSubAdmins?.();
            }
        } catch (error) {
            log.error('Error deleting sub-admin', error as unknown);
            setLocalError('Failed to delete sub-admin');
        }
    };

    const handleSubmitSubAdmin = async (form: { name: string; email: string }) => {
        try {
            if (editingSubAdmin) {
                await updateSubAdmin?.({userId: editingSubAdmin.userId?.toString() || "", ...form});
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
            log.error('Error saving sub-admin', error as unknown);
            setLocalError('Failed to save sub-admin');
        }
    };

    // Table & Modal
    const subAdminTable = (
        <SubAdminTable
            subAdmins={Array.isArray(subAdmins) ? subAdmins : []}
            loading={loading && !loadError}
            onEdit={handleEditSubAdmin}
            onDelete={(id) => {
                try {
                    handleDeleteSubAdmin(String(id));
                } catch (e) {
                    log.error('Delete handler error', e as unknown);
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
                } catch (e) {
                    log.error('Close modal error', e as unknown);
                }
            }}
            onSubmit={handleSubmitSubAdmin}
            initialData={editingSubAdmin}
        />
    );

    // Error section
    const errorSection = loadError ? (
        <ErrorBanner
            message={loadError}
            onRetry={async () => {
                try {
                    setLocalError(null);
                    await fetchSubAdmins?.();
                } catch (err) {
                    log.error('Retry failed', err as unknown);
                }
            }}
            className="mb-4"
        />
    ) : null;

    const buttons = (
        <SubAdminActions onAdd={handleAddSubAdmin} disabled={loading && !loadError} />
    );

    return (
        <GenericLayout
            title={PAGE_TITLES.SUB_ADMIN_MANAGEMENT}
            subtitle={PAGE_SUBTITLES.SUB_ADMIN_MANAGEMENT}
            filters={null}
            buttons={buttons}
            errorSection={errorSection}
            table={subAdminTable}
            modal={subAdminModal}
        />
    );
};

export default SubAdminManagement;
