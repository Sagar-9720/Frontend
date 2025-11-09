import React, {useState, useMemo} from "react";
import UserTable from "./components/UserTable";
import {useUserData} from "../../DataManagers/userDataManager";
import {User} from "../../models/entity/User";
import {GenericLayout} from "../../components/layout/Layout";
import {ErrorBanner} from "../../components/common/ErrorBanner";
import {logger} from "../../utils";
import { PAGE_TITLES, PAGE_SUBTITLES } from "../../utils";
import { UserFilters } from "./sections/UserFilters";
import { UserActions } from "./sections/UserActions";

const log = logger.forSource('UsersPage');

// Helper for CSV export with error handling
const getCSVData = (users: User[]) => {
    try {
        if (!Array.isArray(users)) {
            log.warn('Invalid users data for CSV export', {usersType: typeof users});
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
                log.error('Error processing user for CSV', {error, user: u} as unknown);
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
        log.error('Error generating CSV data', error as unknown);
        return [];
    }
};

const UserManagement: React.FC = () => {
    const {
        users,
        usersLoading,
        usersError,
        refetchUsers,
        deleteRequestUsers,
        deleteReqLoading,
        deleteReqError,
        refetchDeleteRequests,
        deleteUser,
    } = useUserData();

    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("");
    const [genderFilter, setGenderFilter] = useState<string>("");
    const [showDeleteRequests, setShowDeleteRequests] = useState(false);
    const [dateRange, setDateRange] = useState<{ from: string; to: string }>({ from: "", to: "" });

    const sourceUsers = showDeleteRequests ? deleteRequestUsers : users;
    const loading = showDeleteRequests ? deleteReqLoading : usersLoading;
    const error = showDeleteRequests ? deleteReqError : usersError;
    const refetch = showDeleteRequests ? refetchDeleteRequests : refetchUsers;

    const filteredUsers = useMemo(() => {
        try {
            if (!Array.isArray(sourceUsers)) return [];
            return sourceUsers.filter((user: User) => {
                try {
                    const searchLower = searchTerm.toLowerCase();
                    const matchesSearch = !searchTerm || (
                        (user?.name || '').toLowerCase().includes(searchLower) ||
                        (user?.email || '').toLowerCase().includes(searchLower) ||
                        (user?.phone || '').toLowerCase().includes(searchLower) ||
                        (user?.dob || '').includes(searchTerm)
                    );
                    const matchesRole = !roleFilter || (user?.roles === roleFilter);
                    const matchesGender = !genderFilter || (user?.gender === genderFilter);
                    const matchesDate = (!dateRange.from || !dateRange.to) || (
                        user?.dob && user.dob >= dateRange.from && user.dob <= dateRange.to
                    );
                    return matchesSearch && matchesRole && matchesGender && matchesDate;
                } catch (e) {
                    log.error('Error filtering user', e as unknown);
                    return false;
                }
            });
        } catch (e) {
            log.error('filteredUsers error', e as unknown);
            return [];
        }
    }, [sourceUsers, searchTerm, roleFilter, genderFilter, dateRange]);

    const handleDelete = async (userId: string) => {
        try {
            if (!userId) return;
            await deleteUser(userId);
            // refetch will be triggered by data manager mutation wrapper
        } catch (e) {
            log.error('Delete user failed', e as unknown);
        }
    };

    const errorSection = error ? (
        <ErrorBanner
            message={error}
            onRetry={() => {
                try { refetch(); } catch (e) { log.error('Retry failed', e as unknown); }
            }}
            className="mb-4"
        />
    ) : null;

    const filters = (
        <UserFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          genderFilter={genderFilter}
          setGenderFilter={setGenderFilter}
          showDeleteRequests={showDeleteRequests}
          setShowDeleteRequests={setShowDeleteRequests}
          dateFrom={dateRange.from}
          setDateFrom={(v) => setDateRange(r => ({...r, from: v}))}
          dateTo={dateRange.to}
          setDateTo={(v) => setDateRange(r => ({...r, to: v}))}
        />
    );

    const buttons = (
        <UserActions csvData={getCSVData(filteredUsers)} />
    );

    const userTable = (
        <UserTable
            users={filteredUsers}
            loading={loading}
            onDelete={handleDelete}
            onApproveDelete={(id) => log.info('TODO approve delete', { id })}
        />
    );

    // Fetch delete requests on demand when toggled
    React.useEffect(() => {
        if (showDeleteRequests) {
            // Only fetch if we have not loaded any delete requests yet
            if (!deleteReqLoading && deleteRequestUsers.length === 0 && !deleteReqError) {
                try { refetchDeleteRequests(); } catch (e) { log.error('On-demand delete requests fetch failed', e as unknown); }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showDeleteRequests]);

    return (
        <GenericLayout
            title={PAGE_TITLES.USER_MANAGEMENT}
            subtitle={PAGE_SUBTITLES.USER_MANAGEMENT}
            filters={filters}
            buttons={buttons}
            errorSection={errorSection}
            table={userTable}
        />
    );
};

export default UserManagement;
