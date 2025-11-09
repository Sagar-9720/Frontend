import {useResource, useMutationWithRefetch} from '../utils/dataManagerFactory';
import {DATA_MANAGER} from '../utils/constants/dataManager';
import {User} from "../models";
import {authService} from "../services/api";
import {logger} from "../utils";

const log = logger.forSource('SubAdminDataManager');

export const useSubAdmins = () => {
    const {data, loading, error, refetch} = useResource<User[], any>({
        sourceName: 'SubAdminDataManager',
        fetchFn: async () => {
            const response = await authService.getAllSubAdmins();
            return Array.isArray(response) ? response : [];
        },
        mapListFn: (raw) => Array.isArray(raw) ? raw : [],
        isList: true,
        errorMessage: DATA_MANAGER.ERRORS.SUBADMINS,
    });

    const createSubAdmin = useMutationWithRefetch(
        async (payload: Record<string, unknown>) => authService.registerSubAdmin(payload),
        refetch,
        'SubAdminDataManager'
    );
    const updateSubAdmin = useMutationWithRefetch(
        async (payload: Record<string, unknown>) => authService.updateUserInfo(payload),
        refetch,
        'SubAdminDataManager'
    );
    const deleteSubAdmin = useMutationWithRefetch(
        async (id: string) => authService.deleteUser(id),
        refetch,
        'SubAdminDataManager'
    );
    const updateSubAdminRole = useMutationWithRefetch(
        async (payload: Record<string, unknown>) => authService.updateRole(payload),
        refetch,
        'SubAdminDataManager'
    );

    return {
        subAdmins: (data as User[]) || [],
        loading,
        error,
        fetchSubAdmins: refetch,
        createSubAdmin,
        updateSubAdmin,
        deleteSubAdmin,
        updateSubAdminRole,
    };
};
